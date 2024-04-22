import { IConnection } from '@core/GenericFactory/IConnection';
import { ISubscription } from '@core/GenericFactory/ISubscription';
import { Atem } from 'atem-connection';

class AtemConnectionmanager implements ISubscription<IConnection> {
  private _connected = false;

  constructor(atem: Atem) {
    atem.on('connected', () => {
      this.setConnected(true);
    });
    atem.on('disconnected', () => {
      this.setConnected(false);
    });
  }

  public get connected(): boolean {
    return this._connected;
  }

  subscribe(i: IConnection): void {
    i.change(this._connected);
  }
  unsubscribe(i: IConnection): void {}

  private setConnected(value: boolean) {
    this._connected = value;
  }
}

export interface IAtemConnection {
  readonly atem: Atem;
  readonly connected: boolean;
  readonly connection: ISubscription<IConnection>;
  startup(): Promise<void>;
}

class AtemConnection implements IAtemConnection {
  readonly atem: Atem;
  readonly connection: AtemConnectionmanager;
  private startupResult: Promise<void> | undefined = undefined;

  constructor(private ip: string) {
    this.atem = new Atem();

    this.atem.on('error', (error) => this.error(error));
    this.atem.on('info', (log) => this.log(log));

    this.connection = new AtemConnectionmanager(this.atem);
  }
  get connected(): boolean {
    return this.connection.connected;
  }

  async startup(): Promise<void> {
    if (this.startupResult === undefined) {
      this.startupResult = this.atem.connect(this.ip);
    }
    return this.startupResult;
  }

  private error(e: string) {}
  private log(log: string) {}
}

export class AtemFactory {
  private connections = new Map<string, { connection: AtemConnection; usages: number }>();

  get(ip: string): IAtemConnection {
    const requestedConnection = this.connections.get(ip);
    if (requestedConnection !== undefined) {
      requestedConnection.usages++;
      return requestedConnection.connection;
    }

    const retval = new AtemConnection(ip);
    this.connections.set(ip, { connection: retval, usages: 1 });
    return retval;
  }

  release(ip: string): Promise<void> {
    const requestedConnection = this.connections.get(ip);
    if (requestedConnection !== undefined) {
      requestedConnection.usages--;
      if (requestedConnection.usages <= 0) {
        const retval = requestedConnection.connection.atem.disconnect();
        this.connections.delete(ip);
        return retval;
      }
    }

    return Promise.resolve();
  }
}
