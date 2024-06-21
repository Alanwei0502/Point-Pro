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
export const startSocketServer = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, { cors: { origin: '*' } });

  io.use(socketMiddleware).on(SocketEvent.Connect, async (socket: Socket) => {
    Logger.info(`Socket Connected: ${socket.id}`);

    socket.on(SocketEvent.JoinRoom, async (roomName) => {
      // Join Room
      socket.join(roomName);
      Logger.info(`Socket Join: ${socket.id} join ${roomName}`);

      // Admin Room
      if (roomName === SocketRoom.ADMIN) {
        socket.on(SocketTopic.RESERVATION, () => {
          console.log('ADMIN', socket.id);

          // send to booking users when reservation is created
          socket.to(SocketRoom.BOOKING).emit(SocketTopic.RESERVATION);
        });

        socket.on(SocketTopic.MENU, () => {
          // send to all dine-in users when menu is updated
          socket.broadcast.except(SocketRoom.BOOKING).emit(SocketTopic.MENU);
        });

        socket.on(SocketTopic.ORDER, (reservationId) => {
          console.log('ADMIN', socket.id);
          // send to kitchen when order is updated
          socket.emit(SocketTopic.ORDER);
          // send to specific dine-in user when order is updated
          socket.to(reservationId).emit(SocketTopic.ORDER);
        });
        return;
      }

      // Booking Customer Room
      if (roomName === SocketRoom.BOOKING) {
        socket.on(SocketTopic.RESERVATION, (reservation) => {
          // send to admin when reservation is created
          // socket.to(SocketRoom.ADMIN).emit(SocketTopic.RESERVATION, reservation);
          // send to all booking users when reservation is created to update the available time
          console.log('BOOKING', socket.id);

          socket.emit(SocketTopic.RESERVATION);
        });
        return;
      }

      // Dine-in Customer Room
      socket.on(SocketTopic.ORDER, (order) => {
        // send to admin when order is created
        socket.to(SocketRoom.ADMIN).emit(SocketTopic.ORDER, order);
        // send to other dine-in users when order is created (other people in the same group)
        socket.emit(SocketTopic.ORDER);
      });
    });

    socket.on(SocketEvent.LeaveRoom, (roomName) => {
      socket.leave(roomName);
      Logger.info(`Socket Leave: ${socket.id} leave ${roomName}`);
    });

    socket.on(SocketEvent.Disconnect, (socket) => {
      Logger.info(`Socket Disconnect: ${socket}`);
    });

    socket.on(SocketEvent.Error, (error) => {
      Logger.error(`Socket Error: ${error}`);
    });

    socket.on(SocketTopic.ORDER, (order) => {
      // send to admin when order is created
      socket.to(SocketRoom.ADMIN).emit(SocketTopic.ORDER, order);
      // send to other dine-in users when order is created (other people in the same group)
      socket.emit(SocketTopic.ORDER);
    });
  });
};
