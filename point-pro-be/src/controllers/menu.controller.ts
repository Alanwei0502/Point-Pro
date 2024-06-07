import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { MenuModel } from '../models';
import {
  ApiResponse,
  ICreateCategoryRequest,
  ICreateSpecialtyItemRequest,
  ICreateSpecialtyRequest,
  IDeleteCategoryRequest,
  IDeleteMealRequest,
  IDeleteSpecialtyItemRequest,
  IDeleteSpecialtyRequest,
  IUpdateCategoriesOrderRequest,
  IUpdateCategoryRequest,
  IUpdateMealOrderRequest,
  IUpdateSpecialtyOrderRequest,
  IUpdateSpecialtyItemsOrderRequest,
  IUpdateSpecialtyRequest,
  ICreateMealRequest,
  IUpdateMealRequest,
} from '../types';

export class MenuController {
  static getMenuHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const categories = await MenuModel.getCustomerCategories();
      const meals = await MenuModel.getCustomerMeals();
      const specialtiesWithItems = await MenuModel.getCustomerSpecialtiesWithItems();

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: {
          categories,
          meals,
          specialtiesWithItems,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // CATEGORY
  static getCategoriesHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const categories = await MenuModel.getCategories();

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  static createCategoryHandler = async (req: ICreateCategoryRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { title, position } = req.body;
      const newCategory = await MenuModel.createCategory(title, position);

      res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: newCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateCategoryHandler = async (req: IUpdateCategoryRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const { title } = req.body;

      // Check if category exists
      const category = await MenuModel.getCategoryById(categoryId);

      if (!category) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Update category
      await MenuModel.updateCateogry(categoryId, title);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteCategoryHandler = async (req: IDeleteCategoryRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { categoryId } = req.params;

      // Check if category exists
      const category = await MenuModel.getCategoryById(categoryId);

      if (!category) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Delete category
      await MenuModel.deleteCategoryById(categoryId);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateCategoryOrderHander = async (req: IUpdateCategoriesOrderRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const categories = req.body;

      await MenuModel.updateCategoriesOrder(categories);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  // MEAL
  static getMealsHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const meals = await MenuModel.getMealsWithCategoryAndSpecialtyItems();

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: meals,
      });
    } catch (error) {
      next(error);
    }
  };

  static createMealHandler = async (req: ICreateMealRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const newMeal = await MenuModel.createMeal(req.body);
      res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: newMeal,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateMealHandler = async (req: IUpdateMealRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { mealId } = req.params;

      // Check if meal exists
      const meal = await MenuModel.getMealById(mealId);

      if (!meal) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Update meal
      await MenuModel.updateMeal(mealId, req.body);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateMealOrderHandler = async (req: IUpdateMealOrderRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const meals = req.body;

      await MenuModel.updateMealsOrder(meals);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteMealHandler = async (req: IDeleteMealRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { mealId } = req.params;

      // Check if meal exists
      const meal = await MenuModel.getMealById(mealId);

      if (!meal) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Delete meal
      await MenuModel.deleteMealById(mealId);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  // SPECIALTY
  static getSpecialtiesHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const specialties = await MenuModel.getSpecialtiesWithItems();

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: specialties,
      });
    } catch (error) {
      next(error);
    }
  };

  static createSpecialtyHandler = async (req: ICreateSpecialtyRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const newSpecialty = await MenuModel.createSpecialty(req.body);

      res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: newSpecialty,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateSpecialtyHandler = async (req: IUpdateSpecialtyRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { specialtyId } = req.params;
      const { title, selectionType } = req.body;

      // Check if specialty exists
      const specialty = await MenuModel.getSpecialtyById(specialtyId);

      if (!specialty) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Update specialty
      await MenuModel.updateSpecialty(specialtyId, title, selectionType);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteSpecialtyHandler = async (req: IDeleteSpecialtyRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { specialtyId } = req.params;

      // Check if specialty exists
      const specialty = await MenuModel.getSpecialtyById(specialtyId);

      if (!specialty) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Delete specialty
      await MenuModel.deleteSpecialtyById(specialtyId);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateSpecialtyOrderHandler = async (req: IUpdateSpecialtyOrderRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const specialties = req.body;
      await MenuModel.updateSpecialtiesOrder(specialties);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  // SPECIALTY ITEM
  static createSpecialtyItemHandler = async (req: ICreateSpecialtyItemRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const newSpecialtyItem = await MenuModel.createSpecialtyItem(req.body);

      res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: newSpecialtyItem,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateSpecialtyItemHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const { specialtyItemId } = req.params;
      const { title, price } = req.body;

      // Check if specialty item exists
      const specialtyItem = await MenuModel.getSpecialtyItemById(specialtyItemId);

      if (!specialtyItem) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Update specialty item
      await MenuModel.updateSpecialtyItem(specialtyItemId, title, price);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateSpecialtyItemOrderHandler = async (req: IUpdateSpecialtyItemsOrderRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const specialtyItems = req.body;

      await MenuModel.updateSpecialtyItemsOrder(specialtyItems);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteSpecialtyItemHandler = async (req: IDeleteSpecialtyItemRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { specialtyItemId } = req.params;

      // Check if specialty item exists
      const specialtyItem = await MenuModel.getSpecialtyItemById(specialtyItemId);

      if (!specialtyItem) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
        return;
      }

      // Delete specialty item
      await MenuModel.deleteSpecialtyItemById(specialtyItemId);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
