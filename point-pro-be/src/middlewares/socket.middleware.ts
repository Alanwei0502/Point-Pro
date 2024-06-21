import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { verifyAdminAndStaffSchema, verifyCustomerSchema } from '../validators';
import { Logger, jwt } from '../helpers';
import { z } from 'zod';

export const socketMiddleware = async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  try {
    // Verify & Decode token
    const token = socket.handshake.headers.token;
    const isBooking = socket.handshake.headers.isbooking === 'true';

    // Skip verification for booking users
    if (isBooking) {
      return next();
    }

    // Verify & Decode token
    const isAdmin = socket.handshake.headers.isadmin === 'true';
    const schema = isAdmin ? verifyAdminAndStaffSchema : verifyCustomerSchema;

    const decoded = await jwt.verify<z.infer<typeof schema>>(token as string);

    if (!decoded) {
      return next(new Error('Authentication error'));
    }

    next();
  } catch (error) {
    Logger.error(`Socket Auth Error: ${error}`);
    next(new Error('Authentication error'));
  }
};
