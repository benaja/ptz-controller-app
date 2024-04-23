import electron from 'electron';

export class SettingsApi {
  getSettings() {
    const loginSettings = electron.app.getLoginItemSettings();

    const appVersion = electron.app.getVersion();

    return {
      openAtLogin: loginSettings.openAtLogin,
      version: appVersion,
    };
  }

  updateSettings({ openAtLogin }) {
    electron.app.setLoginItemSettings({
      openAtLogin,
    });
  }
}
