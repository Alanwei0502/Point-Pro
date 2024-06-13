import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../types';
import { MailService } from '../helpers';
import { NewsletterSubscribeModel } from '../models';

export class NewsletterController {
  static async subscribe(req: Request, res: ApiResponse, next: NextFunction) {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: '請提供正確的信箱地址',
        });
      }

      // Check if email is already subscribed
      const isSubscribed = await NewsletterSubscribeModel.findSubscriber(email);
      if (isSubscribed) {
        return res.status(StatusCodes.CONFLICT).send({
          message: ReasonPhrases.CONFLICT,
          result: '此信箱已經訂閱過了',
        });
      }

      // Subscribe email
      await NewsletterSubscribeModel.subscribe(email);

      // Send email
      await MailService.sendMail('newsletter', {}, { to: email });
      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  }
}
