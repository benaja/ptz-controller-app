import { shell } from 'electron';
import log from 'electron-log/main';

export class LogsApi {
  public openLogFile(): void {
    console.log(log.transports.file.getFile());
    // open log
    shell.openPath(log.transports.file.getFile().path);
  }
}
