import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../types/shared';
import { imgurClient } from '../helpers';
import { IDeleteCategoryRequest, IDeleteMealRequest, IPatchImageRequest, IUploadImageRequest } from '../types';
import { MenuModel } from '../models';

export class ImgurController {
  static uploadImageHandler = async (req: IUploadImageRequest, res: ApiResponse, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: 'Please upload a file!',
        });
      }

      const imgurRes = await imgurClient.upload({
        image: req.file.buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID,
        title: req.body.title,
        description: req.body.description,
      });

      if (!imgurRes.success) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: 'Failed to upload image!',
        });
      }

      req.body.imageId = imgurRes.data.id;
      req.body.imageDeleteHash = imgurRes.data.deletehash ?? null;

      next();
    } catch (error) {
      next(error);
    }
  };

  static patchImageHandler = async (req: IPatchImageRequest, res: ApiResponse, next: NextFunction) => {
    try {
      // if there is no file, skip the image upload
      if (!req.file) return next();

      // delete the old image
      if (req.body.imageDeleteHash) {
        await imgurClient.deleteImage(req.body.imageDeleteHash);
      }

      // upload the new image
      const imgurRes = await imgurClient.upload({
        image: req.file.buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID,
        title: req.body.title,
        description: req.body.description,
      });

      if (!imgurRes.success) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: 'Failed to upload image!',
        });
      }

      req.body.imageId = imgurRes.data.id;
      req.body.imageDeleteHash = imgurRes.data.deletehash ?? null;

      next();
    } catch (error) {
      next(error);
    }
  };

  static deleteImageHandler = async (req: IDeleteMealRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { mealId } = req.params;

      // get the image delete hash
      const meal = await MenuModel.getMealById(mealId);

      if (meal?.imageDeleteHash) {
        await imgurClient.deleteImage(meal.imageDeleteHash);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  static deleteImagesByDeletingCategoryHandler = async (req: IDeleteCategoryRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { categoryId } = req.params;

      // get the image delete hashes
      const meals = await MenuModel.getMealsDeleteHashesByCategoryId(categoryId);

      // delete the images from imgur
      if (meals.length) {
        const deletePromises = meals.map((m) => {
          if (m.imageDeleteHash) return imgurClient.deleteImage(m.imageDeleteHash);
        });

        await Promise.all(deletePromises);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
