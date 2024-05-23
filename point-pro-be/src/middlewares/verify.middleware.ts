import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { ApiResponse, AuthRequest } from '../types/shared';
import { verifyAdminSchema, verifyReservationSchema } from '../validators';

const verifyUserSchema = verifyAdminSchema || verifyReservationSchema;

const secret = process.env.POINT_PRO_SECRET || 'point-proo';

export const verifyMiddleware = (excludes?: string[]) => (req: AuthRequest, res: ApiResponse, next: NextFunction) => {
  if (excludes && excludes.includes(req.path)) {
    return next();
  }
  const token = req.headers.authorization?.split(' ')[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res.status(401).send({
      message: 'invalid token',
      result: null,
    });
  } else {
    let decoded: string | jwt.JwtPayload = '';

    // console.log('decode', decoded);
    const errors = [];
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      errors.push(error as string);
    }
    try {
      const user = verifyUserSchema.parse(decoded);
      // console.log('user', user);

      req.auth = user;
      next();
    } catch (error) {
      errors.push(error as string);
    }

    if (!errors) {
      next();
    }

    try {
      verifyReservationSchema.validateSync(decoded);
      const reservation = verifyReservationSchema.cast(decoded);
      console.log('reservation', reservation);

      req.auth = { ...reservation, role: 'USER' };
      next();
    } catch (error) {
      errors.push(error as string);
    }

    if (errors.length > 1) {
      res.status(403).send({
        message: errors.join('; '),
        result: null,
      });
    }
  }
};
