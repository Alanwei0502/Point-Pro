import { Router } from 'express';
import { ImgurController } from '../controllers';
import { multerUploadMiddleware } from '../middlewares/multer.middleware';

const imgurRouter = Router();

imgurRouter.post('/', multerUploadMiddleware, ImgurController.uploadImageHandler);
imgurRouter.delete('/', ImgurController.deleteImageHandler);

export default imgurRouter;
