import { NextFunction, Request } from 'express';
import { ApiResponse } from '../types/shared';
import { MenuModel } from '../models';

export class MenuController {
  public static getMenuHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const categories = await MenuModel.getCustomerCategories();
      const meals = await MenuModel.getCustomerMeals();
      const specialtiesWithItems = await MenuModel.getCustomerSpecialtiesWithItems();

      return res.status(200).send({
        message: 'success',
        result: {
          categories,
          meals,
          specialtiesWithItems,
        },
      });
    } catch (error) {
      res.status(500).send({
        message: (error as Error).message,
        result: null,
      });
    }
  };
}
