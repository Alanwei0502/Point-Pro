import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import { Payment } from '@prisma/client';
import { ICreatePaymentRequest } from '../types';

const LINEPAY_CHANNEL_ID = process.env.LINEPAY_CHANNEL_ID!;
const LINEPAY_SECRET = process.env.LINEPAY_SECRET!;
const LINEPAY_SITE = process.env.LINEPAY_SITE!;
const LINEPAY_VERSION = process.env.LINEPAY_VERSION!;
const LINEPAY_RETURN_HOST = process.env.CLIENT_URL!;

interface LinePayOrder {
  amount: number;
  orderId: string;
  packages: {
    id: string;
    amount: number;
    name?: string;
    userFee?: number;
    products: {
      id?: string;
      name: string;
      imageUrl?: string;
      quantity: number;
      price: number;
    }[];
  }[];
}

interface LinePayConfirmBody {
  amount: number;
  currency: string;
}

export class LinePayClient {
  static currency = 'TWD';
  static url = `${LINEPAY_SITE}/${LINEPAY_VERSION}`;
  static requestUri = '/payments/request';
  static confirmUri = (transactionId: string) => `/payments/${transactionId}/confirm`;

  static createSignature = (uri: string, linePayBody: ReturnType<typeof LinePayClient.createLinePayBody> | LinePayConfirmBody) => {
    const nonce = Date.now();
    const encrypt = hmacSHA256(`${LINEPAY_SECRET}/${LINEPAY_VERSION}${uri}${JSON.stringify(linePayBody)}${nonce}`, LINEPAY_SECRET);
    const signature = Base64.stringify(encrypt);

    const headers = {
      'Content-Type': 'application/json',
      'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
      'X-LINE-Authorization-Nonce': nonce.toString(),
      'X-LINE-Authorization': signature,
    };
    return headers;
  };

  static createLinePayBody(order: LinePayOrder) {
    return {
      ...order,
      currency: LinePayClient.currency,
      redirectUrls: {
        confirmUrl: `${LINEPAY_RETURN_HOST}/linepay/confirm`,
        cancelUrl: `${LINEPAY_RETURN_HOST}/linepay/cancel`,
      },
    };
  }

  static async requestPayment(payment: Payment, req: ICreatePaymentRequest) {
    const linePayBody = LinePayClient.createLinePayBody({
      amount: payment.price,
      orderId: payment.id,
      packages: req.body.map((o) => ({
        id: o.id,
        amount: o.totalPrice,
        products: o.orderMeals.map((m) => ({
          name: m.meals.title,
          price: m.meals.price,
          quantity: m.amount,
        })),
      })),
    });

    const linePayHeader = LinePayClient.createSignature(LinePayClient.requestUri, linePayBody);

    const linePayRes = await fetch(`${LinePayClient.url}${LinePayClient.requestUri}`, {
      method: 'POST',
      headers: linePayHeader,
      body: JSON.stringify(linePayBody),
    });

    return await linePayRes.json();
  }

  static async confirmRequest(amount: number, transactionId: string) {
    const linePayBody = {
      amount,
      currency: LinePayClient.currency,
    };
    const linePayHeader = LinePayClient.createSignature(LinePayClient.confirmUri(transactionId), linePayBody);

    const linePayRes = await (
      await fetch(`${LinePayClient.url}${LinePayClient.confirmUri(transactionId)}`, {
        method: 'POST',
        headers: linePayHeader,
        body: JSON.stringify(linePayBody),
      })
    ).json();

    return linePayRes;
  }
}
