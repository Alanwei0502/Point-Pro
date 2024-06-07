import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { SessionRedis, jwt } from '../helpers';
import { ApiResponse, AuthRequest } from '../types';
import { verifyAdminAndStaffSchema, verifyReservationSchema } from '../validators';
import { z } from 'zod';

export const blackListedToken: string[] = [];

// TODO
// const verifyUserSchema = verifyAdminAndStaffSchema || verifyReservationSchema;

export const authMiddleware = async (req: AuthRequest, res: ApiResponse, next: NextFunction) => {
  try {
    // Check if Authorization header is set
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: ReasonPhrases.UNAUTHORIZED,
        result: 'invalid token',
      });
    }

    // Check if decoded JWT is valid
    try {
      const userSession = await jwt.verify<z.infer<typeof verifyAdminAndStaffSchema>>(token);

      const storedToken = await SessionRedis.getSession(userSession.id);

      if (!storedToken || storedToken !== token) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: ReasonPhrases.UNAUTHORIZED,
          result: 'invalid token',
        });
      }

      req.auth = userSession;
      next();
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: ReasonPhrases.UNAUTHORIZED,
        result: 'invalid token',
      });
    }
  } catch (error) {
    next(error);
  }
};
