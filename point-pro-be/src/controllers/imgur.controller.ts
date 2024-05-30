import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { differenceWith } from 'ramda';
import { ApiResponse } from '../types/shared';
import { imgurClient, prismaClient } from '../helpers';
import { IDeleteMealRequest, IUploadImageRequest } from '../types';

export class ImgurController {
  static uploadImageHandler = async (req: IUploadImageRequest, res: ApiResponse, next: NextFunction) => {
    try {
      if (req.file === undefined) {
        res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: 'Please upload a file!',
        });
        return;
      }

      const response = await imgurClient.upload({
        image: req.file.buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID,
        title: req.body.title,
        description: req.body.description,
      });

      req.body.imageId = response.data.id;
      req.body.imageDeleteHash = response.data.deletehash as string;

      next();
    } catch (error) {
      next(error);
    }
  };

  static deleteImageHandler = async (req: IDeleteMealRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { imageDeleteHash } = req.params;
      await imgurClient.deleteImage(imageDeleteHash);
      next();
    } catch (error) {
      next(error);
    }
  };
}
