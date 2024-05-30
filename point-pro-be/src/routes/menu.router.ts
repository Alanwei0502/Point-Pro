import { Router } from 'express';
import { ImgurController, MenuController } from '../controllers';
import { validateMiddleware, multerUploadMiddleware, transformFormDataMiddleware } from '../middlewares';
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
} from '../validators';

const menuRouter = Router();
menuRouter.get('/', MenuController.getMenuHandler);

// CATEGORY
const categoryRouter = Router();
categoryRouter.get('/', MenuController.getCategoriesHandler);
categoryRouter.post('/', validateMiddleware(createCategoryRequestSchema), MenuController.createCategoryHandler);
categoryRouter.patch('/:categoryId', validateMiddleware(updateCategoryRequestSchema), MenuController.updateCategoryHandler);
categoryRouter.patch('/', validateMiddleware(updateCategoryOrderRequestSchema), MenuController.updateCategoryOrderHander);
categoryRouter.delete('/:categoryId', MenuController.deleteCategoryHandler);

// MEAL
const mealRouter = Router();
mealRouter.get('/', MenuController.getMealsHandler);
// mealRouter.get('/:mealId', MenuController.getMealHandler);
mealRouter.post(
  '/',
  multerUploadMiddleware,
  transformFormDataMiddleware,
  ImgurController.uploadImageHandler,
  validateMiddleware(createMealRequestSchema),
  MenuController.createMealHandler,
);
// mealRouter.patch('/:mealId', MenuController.updateMealHandler);
mealRouter.patch('/', MenuController.updateMealOrderHandler);
mealRouter.delete(
  '/:id/:imageDeleteHash',
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
specialtyRouter.delete('/:specialtyId', MenuController.deleteSpecialtyHandler);

// SPECIALTY ITEM
const specialtyItemRouter = Router();
specialtyItemRouter.post('/', validateMiddleware(createSpecialtyItemRequestSchema), MenuController.createSpecialtyItemHandler);
specialtyItemRouter.patch('/:specialtyItemId', validateMiddleware(updateSpecialtyItemRequestSchema), MenuController.updateSpecialtyItemHandler);
specialtyItemRouter.patch('/', validateMiddleware(updateSpecialtyItemOrderRequestSchema), MenuController.updateSpecialtyItemOrderHandler);
specialtyItemRouter.delete('/:specialtyItemId', MenuController.deleteSpecialtyItemHandler);

menuRouter.use('/category', categoryRouter);
menuRouter.use('/meal', mealRouter);
menuRouter.use('/specialty', specialtyRouter);
menuRouter.use('/specialty-items', specialtyItemRouter);
export default menuRouter;
