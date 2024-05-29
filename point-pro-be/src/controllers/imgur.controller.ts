import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { differenceWith } from 'ramda';
import { ApiResponse } from '../types/shared';
import { imgurClient, prismaClient } from '../helpers';
import { IUploadImageRequest } from '../types';

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
      });

      res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: response.data.link,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteImageHandler = async (_: Request, res: ApiResponse) => {
    // validate input
    try {
      const album = await imgurClient.getAlbum(process.env.IMGUR_ALBUM_ID as string);
      let albumImages = album.data.images.map((e) => ({
        link: e.link,
        deletehash: e.deletehash,
      }));
      const meals = await prismaClient.meal.findMany();
      let mealImages = meals.map((e) => ({ link: e.coverUrl, deletehash: null }));

      let diff = differenceWith((x, y) => x.link === y.link, albumImages, mealImages);

      album.data.images.forEach((e) => {
        imgurClient.deleteImage(e.deletehash as string);
      });

      let result = await Promise.all(diff.map((e) => imgurClient.deleteImage(e.deletehash as string)));

      return res.status(204).send({
        message: 'successfully delete a images',
        result,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).send({
          message: error.message,
          result: null,
        });
      }
    }
  };
}
