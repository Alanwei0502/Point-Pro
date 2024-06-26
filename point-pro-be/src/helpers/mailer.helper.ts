import nodemailer from 'nodemailer';
import { compile } from 'ejs';
import path from 'path';
import fs from 'fs';
import { Reservation } from '@prisma/client';
import { Logger } from './logger.helper';

const emailInfo = {
  reservationConfirm: {
    subject: '港都熱炒 - 預約確認',
    templateName: 'reservationConfirm.template.ejs',
  },
  newsletter: {
    subject: 'PointPro - 感謝您的訂閱',
    templateName: 'newsletter.template.ejs',
  },
};

interface IEmail {
  reservationConfirm: {
    context: {
      username: Reservation['username'];
      gender: string;
      people: Reservation['people'];
      remark: Reservation['remark'];
      time: string;
    };
  };
  newsletter: {
    context: {};
  };
}

type EmailType = keyof IEmail;

export class MailService {
  static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  static getTemplate = <T extends EmailType, C extends IEmail[T]['context']>(type: T, context: C) => {
    const templatePath = path.join(__dirname, '../templates', emailInfo[type].templateName);
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = compile(template)(context);
    return html;
  };

  static async sendMail<T extends EmailType, C extends IEmail[T]['context']>(
    type: T,
    context: C,
    mailOptions: nodemailer.SendMailOptions,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      await MailService.transporter.verify();

      return await MailService.transporter.sendMail({
        from: process.env.GMAIL_USER,
        subject: emailInfo[type].subject,
        html: MailService.getTemplate(type, context),
        ...mailOptions,
      });
    } catch (error) {
      Logger.error(`MailService Error: ${error}`);
      return error;
    }
  }
}
