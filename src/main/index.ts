import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import path from 'path';
import { setupApp } from './setupApp';
import { updateElectronApp } from 'update-electron-app';
import log from 'electron-log/main';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const GAMEPAD_WINDOW_WEBPACK_ENTRY: string;
declare const GAMEPAD_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

updateElectronApp();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

log.initialize();
log.errorHandler.startCatching();

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow: BrowserWindow | null = null;
  let gamepadWindow: BrowserWindow | null = null;

  if (log.hooks.length === 0) {
    log.hooks.push((message, transport) => {
      if (transport !== log.transports.file) {
        return message;
      }

      mainWindow?.webContents.send('onLog', message);
      return message;
    });
  }

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    // const mainWindow = BrowserWindow.getAllWindows()[0];
    // if (mainWindow) {
    //   if (mainWindow.isMinimized()) mainWindow.restore();
    //   mainWindow.focus();
    // }
  });

  const createMainWindow = () => {
    mainWindow = new BrowserWindow({
      title: 'Main',
      width: 1200,
      height: 600,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    app.commandLine.appendSwitch('disable-hid-blocklist');

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    // gamepadWindow.webContents.openDevTools();
    // only open dev tools in dev mode
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
    mainWindow.show();

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  };

  const createGamepadWindow = () => {
    gamepadWindow = new BrowserWindow({
      title: 'Gamepads',
      width: 800,
      height: 600,
      webPreferences: {
        preload: GAMEPAD_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      show: false,
    });

    gamepadWindow.focus();

    gamepadWindow.loadURL(GAMEPAD_WINDOW_WEBPACK_ENTRY);
  };

  let tray: Tray | null = null;
  const createTray = () => {
    const iconPath = path.resolve(__dirname, 'assets/img/tray-icon.png');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
          } else {
            createMainWindow();
          }
        },
      },
      {
        label: 'Focus Gamepads',
        click: () => {
          gamepadWindow?.focus();
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    tray.setToolTip('PTZ Controller');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      // This can be used to toggle the app window, for example
    });
  };

  const onAppReady = () => {
    setupApp();

    createGamepadWindow();

    createTray();
  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', onAppReady);

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {});

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    const windows = BrowserWindow.getAllWindows();

    if (windows.length === 1 && windows[0] === gamepadWindow) {
      createMainWindow();
    } else if (windows.length === 0) {
      createMainWindow();
      createGamepadWindow();
    }
  });
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
