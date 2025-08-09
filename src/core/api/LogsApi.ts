import { shell } from 'electron';
import log from 'electron-log/main';

export class LogsApi {
  public openLogFile(): void {
    console.log(log.transports.file.getFile());
    // open log
    shell.openPath(log.transports.file.getFile().path);
  }

  public getLatestLogs(): string[] {
    const logs = log.transports.file.readAllLogs({
      fileFilter: (logFile) => logFile.endsWith('main.log'),
    });

    // return last 1000 lines
    if (logs.length) {
      return logs[0].lines.slice(-1000).toReversed();
    }

    return [];
  }

  // Opening a logs window is handled by the main process (tray/menu).
}
