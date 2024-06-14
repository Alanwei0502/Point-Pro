import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { ILoginRequest, IRegisterRequest, ApiResponse, AuthRequest } from '../types';
import { UserModel } from '../models';
import { SessionRedis, hashPassword, jwt } from '../helpers';

export class AuthController {
  static registerHandler = async (req: IRegisterRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { username, gender, phone, email, role } = req.body;

      // Check if user exists
      const user = await UserModel.findUser({ username, phone });

      if (user) {
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          result: '使用者已存在',
        });
      }

      // Hash password with bcrypt
      const passwordHash = hashPassword(req.body.phone);

      // Create user
      await UserModel.createUser({
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
      const user = await UserModel.findUser({ username });

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: '找不到使用者',
        });
      }

      // Check user's password is correct
      if (!user.passwordHash) {
        return res.status(StatusCodes.FORBIDDEN).send({
          message: ReasonPhrases.FORBIDDEN,
          result: '未設立密碼',
        });
      }

      // Check if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordCorrect) {
        return res.status(StatusCodes.FORBIDDEN).send({
          message: ReasonPhrases.FORBIDDEN,
          result: '密碼錯誤',
        });
      }

      // Create JWT token
      const token = await jwt.sign({
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
      });

      // Redis set token
      await SessionRedis.setSession(user.id, jwt.adminExpirationTime, token);

      // Create login log
      await UserModel.createLoginLog({ userId: user.id });

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
      if (!req.auth) {
        return res.status(StatusCodes.FORBIDDEN).send({
          message: ReasonPhrases.FORBIDDEN,
          result: '未登入',
        });
      }

      await SessionRedis.deleteSession(req.auth?.id);
      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: '登出成功',
      });
    } catch (error) {
      next(error);
    }
  };
}
