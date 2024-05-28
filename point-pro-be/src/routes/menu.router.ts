import { Router } from 'express';
import { MenuController } from '../controllers';
import { validateMiddleware } from '../middlewares';
import {
  createCategoryRequestSchema,
  createSpecialtyRequestSchema,
  deleteCategoryRequestSchema,
  deleteSpecialtyRequestSchema,
  getCategoryByIdRequestSchema,
  getSpecialtyByIdRequestSchema,
  updateCategoryRequestSchema,
  updateCategoriesOrderRequestSchema,
  updateSpecialtyRequestSchema,
} from '../validators';

const menuRouter = Router();
menuRouter.get('/', MenuController.getMenuHandler);

const categoryRouter = Router();
categoryRouter.get('/', MenuController.getCategoriesHandler);
categoryRouter.get('/:categoryId', validateMiddleware(getCategoryByIdRequestSchema, 'params'), MenuController.getCategoryByIdHandler);
categoryRouter.post('/', validateMiddleware(createCategoryRequestSchema), MenuController.createCategoryHandler);
categoryRouter.patch('/:categoryId', validateMiddleware(updateCategoryRequestSchema), MenuController.updateCategoryHandler);
categoryRouter.delete('/:categoryId', validateMiddleware(deleteCategoryRequestSchema, 'params'), MenuController.deleteCategoryHandler);
categoryRouter.patch('/', validateMiddleware(updateCategoriesOrderRequestSchema), MenuController.updateCategoriesOrderHander);

const mealRouter = Router();
mealRouter.get('/', MenuController.getMealsHandler);
// mealRouter.get('/:mealId', MenuController.getMealHandler);
// mealRouter.post('/', MenuController.createMealHandler);
// mealRouter.patch('/:mealId', MenuController.updateMealHandler);
// mealRouter.delete('/:mealId', MenuController.deleteMealHandler);

const specialtyRouter = Router();
specialtyRouter.get('/', MenuController.getSpecialtiesHandler);
specialtyRouter.get('/:specialtyId', validateMiddleware(getSpecialtyByIdRequestSchema), MenuController.getSpecialtyByIdHandler);
specialtyRouter.post('/', validateMiddleware(createSpecialtyRequestSchema), MenuController.createSpecialtyHandler);
specialtyRouter.patch('/:specialtyId', validateMiddleware(updateSpecialtyRequestSchema), MenuController.updateSpecialtyHandler);
specialtyRouter.delete('/:specialtyId', validateMiddleware(deleteSpecialtyRequestSchema), MenuController.deleteSpecialtyHandler);

menuRouter.use('/category', categoryRouter);
menuRouter.use('/meal', mealRouter);
menuRouter.use('/specialty', specialtyRouter);
export default menuRouter;
