import { prismaClient } from '../helpers';

export class NewsletterSubscribeModel {
  static async subscribe(email: string) {
    await prismaClient.newsletterSubscriber.create({
      data: {
        email,
      },
    });
  }

  static async findSubscriber(email: string) {
    const res = await prismaClient.newsletterSubscriber.findUnique({
      where: {
        email,
      },
    });

    return res;
  }
}
