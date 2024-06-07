import { NextFunction, Request } from 'express';
import { Role } from '@prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { object, string } from 'yup';
import bcrypt from 'bcryptjs';
import { AuthService } from '../services';
import { ILoginRequest, IRegisterRequest, ApiResponse, AuthRequest } from '../types';
import { userModel } from '../models';
import { SessionRedis, jwt } from '../helpers';

export class AuthController {
  static decodeTokenHandler = async (req: AuthRequest, res: ApiResponse) => {
    return res.status(StatusCodes.OK).send({
      message: ReasonPhrases.OK,
      result: req.auth,
    });
  };

  static generateTokenHandler = async (req: Request, res: ApiResponse) => {
    // validate input
    const inputSchema = object({
      reservationId: string().uuid().required().lowercase(),
    });

    try {
      await inputSchema.validate(req.body);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).send({
          message: `invalid input:${error.message}`,
          result: null,
        });
      }
    }

    const { reservationId } = inputSchema.cast(req.body);

    try {
      const token = await AuthService.generateReservationToken(reservationId);

      res.status(200).send({
        message: 'successfully create token',
        result: {
          token,
        },
      });
    } catch (error) {}
  };

  static registerHandler = async (req: IRegisterRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { username, gender, phone, email, role } = req.body;

      // Check if user exists
      const user = await userModel.findUserByUsername({ username });

      if (user) {
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          result: 'User already exists',
        });
      }

      // Hash password with bcrypt
      if (!process.env.JWT_SALT_ROUND) throw new Error('No Salt Round');
      const passwordHash = bcrypt.hashSync(req.body.phone, Number(process.env.JWT_SALT_ROUND));

      // Create user and return JWT token
      const newUser = await userModel.createStaffUser({
        username,
        gender,
        phone,
        email,
        role,
        passwordHash,
      });

      return res.status(StatusCodes.CREATED).json({
        message: ReasonPhrases.CREATED,
        result: 'User created',
      });
    } catch (error) {
      next(error);
    }
  };

  static loginHandler = async (req: ILoginRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const user = await userModel.findUserByUsername({ username });

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: 'User not found',
        });
      }

      // Check if user is admin or staff
      if (user.role === Role.CUSTOMER) {
        return res.status(StatusCodes.FORBIDDEN).send({
          message: ReasonPhrases.FORBIDDEN,
          result: 'User is not admin or staff',
        });
      }

      // Check user's password is correct
      if (!user.passwordHash) {
        return res.status(StatusCodes.FORBIDDEN).send({
          message: ReasonPhrases.FORBIDDEN,
          result: 'User has not set password yet',
        });
      }

      // Check if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordCorrect) {
        return res.status(StatusCodes.FORBIDDEN).send({
          message: ReasonPhrases.FORBIDDEN,
          result: 'Password is incorrect',
        });
      }

      // Create JWT token
      const token = await jwt.sign({
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
      });

      // Redis set token
      await SessionRedis.setSession(user.id, jwt.expiresIn, token);

      // Create login log
      await userModel.createLoginLog({ userId: user.id });

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        result: token,
      });
    } catch (error) {
      next(error);
    }
  };

  static logoutHandler = async (req: AuthRequest, res: ApiResponse, next: NextFunction) => {
    try {
      await SessionRedis.deleteSession(req.auth.id);
      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: 'Logout successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
