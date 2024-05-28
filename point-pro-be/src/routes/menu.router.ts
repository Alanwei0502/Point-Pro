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
  updateSpecialtiesOrderRequestSchema,
} from '../validators';

const menuRouter = Router();
menuRouter.get('/', MenuController.getMenuHandler);

// CATEGORY
const categoryRouter = Router();
categoryRouter.get('/', MenuController.getCategoriesHandler);
categoryRouter.post('/', validateMiddleware(createCategoryRequestSchema), MenuController.createCategoryHandler);
categoryRouter.patch('/:categoryId', validateMiddleware(updateCategoryRequestSchema), MenuController.updateCategoryHandler);
categoryRouter.delete('/:categoryId', validateMiddleware(deleteCategoryRequestSchema, 'params'), MenuController.deleteCategoryHandler);
categoryRouter.patch('/', validateMiddleware(updateCategoriesOrderRequestSchema), MenuController.updateCategoriesOrderHander);

// MEAL
const mealRouter = Router();
mealRouter.get('/', MenuController.getMealsHandler);
// mealRouter.get('/:mealId', MenuController.getMealHandler);
// mealRouter.post('/', MenuController.createMealHandler);
// mealRouter.patch('/:mealId', MenuController.updateMealHandler);
// mealRouter.delete('/:mealId', MenuController.deleteMealHandler);

// SPECIALTY
const specialtyRouter = Router();
specialtyRouter.get('/', MenuController.getSpecialtiesHandler);
specialtyRouter.post('/', validateMiddleware(createSpecialtyRequestSchema), MenuController.createSpecialtyHandler);
specialtyRouter.patch('/:specialtyId', validateMiddleware(updateSpecialtyRequestSchema), MenuController.updateSpecialtyHandler);
specialtyRouter.delete('/:specialtyId', validateMiddleware(deleteSpecialtyRequestSchema, 'params'), MenuController.deleteSpecialtyHandler);
specialtyRouter.patch('/', validateMiddleware(updateSpecialtiesOrderRequestSchema), MenuController.updateSpecialtiesOrderHandler);

menuRouter.use('/category', categoryRouter);
menuRouter.use('/meal', mealRouter);
menuRouter.use('/specialty', specialtyRouter);
export default menuRouter;
