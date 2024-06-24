import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Logger } from '.';
import { socketMiddleware } from '../middlewares';

enum SocketRoom {
  ADMIN = 'admin',
  BOOKING = 'booking',
  // others are grouped by reservationId
}

enum SocketTopic {
  MENU = 'MENU',
  ORDER = 'ORDER',
  RESERVATION = 'RESERVATION',
}

enum SocketEvent {
  // Main events
  Connect = 'connect',
  Disconnect = 'disconnect',
  Error = 'error',
  // Emit events
  JoinRoom = 'join-room',
  LeaveRoom = 'leave-room',
}

// Socket Server
export const startSocketServer = (httpServer: HttpServer): void => {
  const io = new SocketIOServer(httpServer, { cors: { origin: '*' } });

  io.use(socketMiddleware).on(SocketEvent.Connect, async (socket: Socket) => {
    Logger.info(`Socket Connected: ${socket.id}`);

    socket.on(SocketEvent.JoinRoom, async (myRoom) => {
      // Join Room
      socket.join(myRoom);
      Logger.info(`Socket Join: ${socket.id} join ${myRoom}`);

      // [ADMIN]
      if (myRoom === SocketRoom.ADMIN) {
        socket.on(SocketTopic.RESERVATION, () => {
          socket.to([myRoom, SocketRoom.BOOKING]).emit(SocketTopic.RESERVATION);
        });

        socket.on(SocketTopic.MENU, () => {
          socket.broadcast.except(SocketRoom.BOOKING).emit(SocketTopic.MENU);
        });

        socket.on(SocketTopic.ORDER, (room) => {
          socket.to([myRoom, room]).emit(SocketTopic.ORDER);
        });
        return;
      }

      // [BOOKING]
      if (myRoom === SocketRoom.BOOKING) {
        socket.on(SocketTopic.RESERVATION, () => {
          socket.to([myRoom, SocketRoom.ADMIN]).emit(SocketTopic.RESERVATION);
        });
        return;
      }

      // [CUSTOMER]
      if (myRoom !== SocketRoom.ADMIN && myRoom !== SocketRoom.BOOKING) {
        socket.on(SocketTopic.ORDER, () => {
          socket.to([myRoom, SocketRoom.ADMIN]).emit(SocketTopic.ORDER);
        });
      }
    });

    socket.on(SocketEvent.LeaveRoom, (myRoom) => {
      socket.leave(myRoom);
      Logger.info(`Socket Leave: ${socket.id} leave ${myRoom}`);
    });

    socket.on(SocketEvent.Disconnect, (socket) => {
      Logger.info(`Socket Disconnect: ${socket}`);
    });

    socket.on(SocketEvent.Error, (error) => {
      Logger.error(`Socket Error: ${error}`);
    });
  });
};
