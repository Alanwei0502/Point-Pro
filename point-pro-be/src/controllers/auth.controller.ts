import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { object, string } from 'yup';
import bcrypt from 'bcryptjs';
import { ApiResponse, AuthRequest } from '../types/shared';
import { AuthService } from '../services';
import { ILoginRequest, IRegisterRequest } from '../types/handler.type';
import { sign } from 'jsonwebtoken';
import { userModel } from '../models';

export class AuthController {
  static decodeTokenHandler = async (req: AuthRequest, res: ApiResponse) => {
    return res.status(200).send({
      message: 'success',
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

      // Hash password
      const saltRound = process.env.SALT_ROUND;
      if (!saltRound) throw new Error('No SALT_ROUND');

      const passwordHash = bcrypt.hashSync(req.body.phone, +saltRound);

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
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          result: 'User not found',
        });
      }

      // Check user's password is correct
      if (user?.passwordHash && !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: ReasonPhrases.FORBIDDEN,
          result: 'Password does not match',
        });
      }

      // Login user and return JWT token
      if (!process.env.POINT_PRO_SECRET) throw new Error('No JWT Secret');

      const authToken = sign(
        {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          role: user.role,
        },
        process.env.POINT_PRO_SECRET,
        { expiresIn: '1 day' },
      );

      // Create login log
      const loginLog = await userModel.createLoginLog({ userId: user.id });

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        result: { authToken, loginLog },
      });
    } catch (error) {
      next(error);
    }
  };

  // static logoutHandler = async (req, res: ApiResponse) => {};
}
