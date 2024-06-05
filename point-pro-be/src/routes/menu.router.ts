import { Router } from 'express';
import { ImgurController, MenuController } from '../controllers';
import {
  validateMiddleware,
  multerUploadMiddleware,
  createMealTransformFormDataMiddleware,
  updateMealTransformFormDataMiddleware,
} from '../middlewares';
import {
  createCategoryRequestSchema,
  createSpecialtyRequestSchema,
  updateCategoryRequestSchema,
  updateCategoryOrderRequestSchema,
  updateSpecialtyRequestSchema,
  updateSpecialtyOrderRequestSchema,
  updateSpecialtyItemOrderRequestSchema,
  updateSpecialtyItemRequestSchema,
  createSpecialtyItemRequestSchema,
  createMealRequestSchema,
  deleteMealRequestSchma,
  updateMealOrderRequestSchema,
  updateMealRequestSchema,
  deleteCategoryRequestSchema,
  deleteSpecialtyItemRequestSchema,
  deleteSpecialtyRequestSchema,
} from '../validators';

const menuRouter = Router();
menuRouter.get('/', MenuController.getMenuHandler);

// CATEGORY
const categoryRouter = Router();
categoryRouter.get('/', MenuController.getCategoriesHandler);
categoryRouter.post('/', validateMiddleware(createCategoryRequestSchema), MenuController.createCategoryHandler);
categoryRouter.patch('/:categoryId', validateMiddleware(updateCategoryRequestSchema), MenuController.updateCategoryHandler);
categoryRouter.patch('/', validateMiddleware(updateCategoryOrderRequestSchema), MenuController.updateCategoryOrderHander);
categoryRouter.delete(
  '/:categoryId',
  validateMiddleware(deleteCategoryRequestSchema, 'params'),
  ImgurController.deleteImagesByDeletingCategoryHandler,
  MenuController.deleteCategoryHandler,
);

// MEAL
const mealRouter = Router();
mealRouter.get('/', MenuController.getMealsHandler);
mealRouter.post(
  '/',
  multerUploadMiddleware,
  createMealTransformFormDataMiddleware,
  ImgurController.uploadImageHandler,
  validateMiddleware(createMealRequestSchema),
  MenuController.createMealHandler,
);
mealRouter.patch(
  '/:mealId',
  multerUploadMiddleware,
  updateMealTransformFormDataMiddleware,
  ImgurController.patchImageHandler,
  validateMiddleware(updateMealRequestSchema),
  MenuController.updateMealHandler,
);
mealRouter.patch('/', validateMiddleware(updateMealOrderRequestSchema), MenuController.updateMealOrderHandler);
mealRouter.delete(
  '/:mealId',
  validateMiddleware(deleteMealRequestSchma, 'params'),
  ImgurController.deleteImageHandler,
  MenuController.deleteMealHandler,
);

// SPECIALTY
const specialtyRouter = Router();
specialtyRouter.get('/', MenuController.getSpecialtiesHandler);
specialtyRouter.post('/', validateMiddleware(createSpecialtyRequestSchema), MenuController.createSpecialtyHandler);
specialtyRouter.patch('/:specialtyId', validateMiddleware(updateSpecialtyRequestSchema), MenuController.updateSpecialtyHandler);
specialtyRouter.patch('/', validateMiddleware(updateSpecialtyOrderRequestSchema), MenuController.updateSpecialtyOrderHandler);
specialtyRouter.delete('/:specialtyId', validateMiddleware(deleteSpecialtyRequestSchema, 'params'), MenuController.deleteSpecialtyHandler);

// SPECIALTY ITEM
const specialtyItemRouter = Router();
specialtyItemRouter.post('/', validateMiddleware(createSpecialtyItemRequestSchema), MenuController.createSpecialtyItemHandler);
specialtyItemRouter.patch('/:specialtyItemId', validateMiddleware(updateSpecialtyItemRequestSchema), MenuController.updateSpecialtyItemHandler);
specialtyItemRouter.patch('/', validateMiddleware(updateSpecialtyItemOrderRequestSchema), MenuController.updateSpecialtyItemOrderHandler);
specialtyItemRouter.delete(
  '/:specialtyItemId',
  validateMiddleware(deleteSpecialtyItemRequestSchema, 'params'),
  MenuController.deleteSpecialtyItemHandler,
);

menuRouter.use('/category', categoryRouter);
menuRouter.use('/meal', mealRouter);
menuRouter.use('/specialty', specialtyRouter);
menuRouter.use('/specialty-items', specialtyItemRouter);
export default menuRouter;
