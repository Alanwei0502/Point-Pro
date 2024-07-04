import { type ManagerOptions, Socket, type SocketOptions, io } from 'socket.io-client';
import { API_HOST } from '~/api/http';

export interface SocketInterface {
  socket: Socket;
}

class SocketConnection implements SocketInterface {
  public socket: Socket;
  public socketEndpoint = API_HOST;

  constructor(opts?: Partial<ManagerOptions & SocketOptions>) {
    this.socket = io(this.socketEndpoint, opts);
  }
}

let socketConnection: SocketConnection | undefined;

export class SocketFactory {
  public static create(opts?: Partial<ManagerOptions & SocketOptions>): SocketConnection {
    if (!socketConnection) {
      socketConnection = new SocketConnection(opts);
    }
    return socketConnection;
  }
}
