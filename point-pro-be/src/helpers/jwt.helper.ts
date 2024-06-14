import jsonwebtoken, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const jwt = {
  adminExpirationTime: 24 * 60 * 60,
  customerExpirationTime: 2 * 60 * 60,
  verify: <Result>(token: string): Promise<Result> => {
    if (!JWT_SECRET) throw new Error('No JWT Secret');

    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as Result);
      });
    });
  },
  sign: (payload: string | object | Buffer, options?: SignOptions): Promise<string> => {
    if (!JWT_SECRET) throw new Error('No JWT Secret');

    return new Promise((resolve, reject) => {
      try {
        resolve(jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: jwt.adminExpirationTime, ...options }));
      } catch (error) {
        reject(error);
      }
    });
  },
  getDiningToken: async (payload: string | object | Buffer, options?: SignOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        resolve(jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: jwt.customerExpirationTime, ...options }));
      } catch (error) {
        reject(error);
      }
    });
  },
};
