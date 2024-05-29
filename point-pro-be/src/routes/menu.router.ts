import { Router } from 'express';
import { MenuController } from '../controllers';
import { validateMiddleware } from '../middlewares';
import {
  createCategoryRequestSchema,
  createSpecialtyRequestSchema,
  deleteCategoryRequestSchema,
  updateCategoryRequestSchema,
  updateCategoryOrderRequestSchema,
  updateSpecialtyRequestSchema,
  updateSpecialtyOrderRequestSchema,
  updateSpecialtyItemOrderRequestSchema,
  updateSpecialtyItemRequestSchema,
  createSpecialtyItemRequestSchema,
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
// mealRouter.post('/', MenuController.createMealHandler);
// mealRouter.patch('/:mealId', MenuController.updateMealHandler);
mealRouter.patch('/', MenuController.updateMealOrderHandler);
mealRouter.delete('/:mealId', MenuController.deleteMealHandler);

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
