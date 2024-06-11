import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Namespace } from 'socket.io/dist/namespace';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { verifyAdminAndStaffSchema, verifyReservationSchema } from '../validators';
import { Logger, jwt } from '.';

// Type
type SocketArgType = {
  mainNs: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  adminNs: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  userNs: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

enum NameSpace {
  main = '/',
  user = '/user',
  admin = '/admin',
}

enum SocketTopic {
  MENU = 'MENU',
  ORDER = 'ORDER',
  RESERVATION = 'RESERVATION',
}

// Main Socket (for booking user)
const mainSocket = ({ mainNs, adminNs, userNs }: SocketArgType) => {
  mainNs.on('connect', (socket) => {
    // Listeners
    socket.on(SocketTopic.RESERVATION, (reservation) => {
      adminNs.emit(SocketTopic.RESERVATION, reservation);
    });

    Logger.info(`BOOKING connected: ${socket.id}`);
  });

  mainNs.on('disconnect', (socket) => {
    Logger.info(`BOOKING disconnected: ${socket.id}`);
  });
};

// User Socket (for order user)
const usersSocket = ({ mainNs, adminNs, userNs }: SocketArgType) => {
  userNs.on('connect', (socket) => {
    try {
      // Verify & Decode Token
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token);
      const reservation = verifyReservationSchema.parse(decoded);

      // Join Room
      socket.join(reservation.reservationId);

      // Listeners
      socket.on(SocketTopic.ORDER, (order) => {
        userNs.to(reservation.reservationId).emit(SocketTopic.ORDER, order);
        adminNs.emit(SocketTopic.ORDER, order);
      });

      Logger.info(`USER connected: ${socket.id}`);
    } catch (error) {
      socket.disconnect();
      Logger.error(JSON.stringify(error));
    }
  });

  userNs.on('disconnect', (socket) => {
    Logger.info(`USER disconnected: ${socket.id}`);
  });
};

// Admin Socket
const adminsSocket = ({ mainNs, adminNs, userNs }: SocketArgType) => {
  adminNs.on('connect', (socket) => {
    try {
      // Verify & Decode token
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token);
      const admin = verifyAdminAndStaffSchema.parse(decoded);

      // Join Room
      socket.join(admin.id);

      // Listeners
      socket.on(SocketTopic.MENU, (menu) => {
        adminNs.except(admin.id).emit(SocketTopic.MENU, menu);
        userNs.emit(SocketTopic.MENU, menu);
      });
      socket.on(SocketTopic.ORDER, (order) => {
        adminNs.except(admin.id).emit(SocketTopic.ORDER, order);
        userNs.to(order.result.reservationId).emit(SocketTopic.ORDER, order);
      });
      socket.on(SocketTopic.RESERVATION, (reservation) => {
        adminNs.except(admin.id).emit(SocketTopic.RESERVATION, reservation);
        userNs.emit(SocketTopic.RESERVATION, reservation);
      });

      Logger.info(`ADMIN connected: ${socket.id}`);
    } catch (error) {
      socket.disconnect();
      Logger.error(JSON.stringify(error));
    }
  });

  adminNs.on('disconnect', (socket) => {
    Logger.info(`ADMIN disconnected: ${socket.id}`);
  });
};

// Socket Server
export const createWsServer = (httpServer: HttpServer) => {
  // [TODO] CORS setting
  const io = new SocketIOServer(httpServer, { cors: { origin: '*' } });

  // Namespaces
  const mainNs = io.of(NameSpace.main);
  const userNs = io.of(NameSpace.user);
  const adminNs = io.of(NameSpace.admin);

  const socketArgs = {
    mainNs,
    userNs,
    adminNs,
  };

  mainSocket(socketArgs);
  usersSocket(socketArgs);
  adminsSocket(socketArgs);
};
