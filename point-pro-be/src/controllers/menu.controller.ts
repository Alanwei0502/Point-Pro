import { NextFunction, Request } from 'express';
import { ApiResponse } from '../types/shared';
import { MenuModel } from '../models';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {
  ICreateCategoryRequest,
  ICreateSpecialtyRequest,
  IDeleteCategoryRequest,
  IDeleteSpecialtyRequest,
  IGetCategoryByIdRequest,
  IGetSpecialtyByIdRequest,
  IUpdateCategoriesOrderRequest,
  IUpdateCategoryRequest,
  IUpdateSpecialtyRequest,
} from '../types/handler.type';

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

  // TODO: delete
  static getCategoryByIdHandler = async (req: IGetCategoryByIdRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const category = await MenuModel.getCategoryById(categoryId);

      if (!category) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
      }

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: category,
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

  static updateCategoriesOrderHander = async (req: IUpdateCategoriesOrderRequest, res: ApiResponse, next: NextFunction) => {
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

  // TODO: delete
  static getSpecialtyByIdHandler = async (req: IGetSpecialtyByIdRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { specialtyId } = req.params;
      const specialty = await MenuModel.getSpecialtyById(specialtyId);

      if (!specialty) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
      }

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: specialty,
      });
    } catch (error) {
      next(error);
    }
  };

  // TODO: delete
  static getSpecialtyItemsHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const specialtyItems = await MenuModel.getSpecialtyItems();

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: specialtyItems,
      });
    } catch (error) {
      next(error);
    }
  };

  static createSpecialtyHandler = async (req: ICreateSpecialtyRequest, res: ApiResponse, next: NextFunction) => {
    // try {
    //  let { title, type, items }: any = inputSchema.cast(req.body);
    //  let newSpecialtyItems = items.filter((item: SpecialtyItem) => !item.id);
    //  let specialtyItems = clone(items);
    //   if (newSpecialtyItems.length > 0) {
    //     const updatedSpecialtyItems = await prisma.specialtyItem.createMany({
    //       data: newSpecialtyItems.map((item: SpecialtyItem) => ({
    //         title: item.title,
    //         price: item.price,
    //       })),
    //       skipDuplicates: true,
    //     });
    //     if (updatedSpecialtyItems.count !== newSpecialtyItems.length) {
    //       return res.status(400).send({
    //         message: 'specialtyItem create error',
    //         result: null,
    //       });
    //     }
    //     specialtyItems = await prisma.specialtyItem.findMany({
    //       where: {
    //         OR: items.map((item: SpecialtyItem) =>
    //           item.id
    //             ? {
    //                 id: item.id,
    //               }
    //             : {
    //                 title: item.title,
    //               },
    //         ),
    //       },
    //     });
    //   }

    //   const specialty = await prisma.specialty.create({
    //     data: {
    //       title,
    //       type,
    //       items: {
    //         createMany: {
    //           data: specialtyItems.map((item: SpecialtyItem) => ({
    //             specialtyItemId: item.id,
    //           })),
    //           skipDuplicates: true,
    //         },
    //       },
    //     },
    //     include: { items: true },
    //   });

    //   res.status(StatusCodes.CREATED).send({
    //     message: ReasonPhrases.CREATED,
    //     result: specialty,
    //   });
    // } catch (error) {
    //   next(error);
    // }

    try {
      const { title, selectionType, position } = req.body;
      const newSpecialty = await MenuModel.createSpecialty(title, selectionType, position);

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
      const { title, selectionType, position } = req.body;

      // Check if specialty exists
      const specialty = await MenuModel.getSpecialtyById(specialtyId);

      if (!specialty) {
        res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
      }

      // Update specialty
      await MenuModel.updateSpecialty(specialtyId, title, selectionType, position);

      res.status(StatusCodes.NO_CONTENT).send({
        message: ReasonPhrases.NO_CONTENT,
        result: null,
      });
    } catch (error) {
      next(error);
    }
    //   // validate input
    //   const inputSchema = object({
    //     title: string().optional(),
    //     type: string().optional(),
    //     items: array()
    //       .of(
    //         object({
    //           id: string().optional(),
    //           title: string().optional(),
    //           price: number().optional(),
    //         }),
    //       )
    //       .optional(),
    //   });
    //   try {
    //     await inputSchema.validate(req.body);
    //   } catch (error) {
    //     res.status(400).send({
    //       message: (error as Error).message,
    //       result: null,
    //     });
    //   }
    //   const { specialtyId } = req.params;
    //   const { title, type, items }: any = inputSchema.cast(req.body);
    //   try {
    //     let targetSpecialty = await prisma.specialty.findUniqueOrThrow<Prisma.SpecialtyFindUniqueOrThrowArgs>({
    //       where: { id: specialtyId },
    //     });
    //     if (items.length === 0) {
    //       await prisma.specialtiesOnSpecialtyItems.deleteMany({
    //         where: { specialtyId },
    //       });
    //     }
    //     if (items.length > 0) {
    //       // create or update specialtyItems
    //       let newSpecialtyItems = items.filter((item: SpecialtyItem) => !item.id);
    //       let oldSpecialtyItems = items.filter((item: SpecialtyItem) => item.id);
    //       let specialtyItems = clone(items);
    //       // create
    //       if (newSpecialtyItems.length > 0) {
    //         const updatedSpecialtyItems = await prisma.specialtyItem.createMany({
    //           data: newSpecialtyItems.map((item: SpecialtyItem) => ({ title: item.title, price: item.price })),
    //           skipDuplicates: true,
    //         });
    //         if (updatedSpecialtyItems.count !== newSpecialtyItems.length) {
    //           res.status(400).send({
    //             message: 'specialtyItem create error',
    //             result: null,
    //           });
    //         }
    //       }
    //       // update
    //       if (oldSpecialtyItems.length > 0) {
    //         let updatedSpecialtyItems = await Promise.all(
    //           oldSpecialtyItems.map((item: SpecialtyItem) =>
    //             prisma.specialtyItem.update({ where: { id: item.id }, data: item }),
    //           ),
    //         );
    //         if (updatedSpecialtyItems.length !== oldSpecialtyItems.length) {
    //           res.status(400).send({
    //             message: 'specialtyItem update error',
    //             result: null,
    //           });
    //         }
    //       }
    //       specialtyItems = await prisma.specialtyItem.findMany({
    //         where: {
    //           OR: items.map((item: SpecialtyItem) =>
    //             item.id
    //               ? {
    //                   id: item.id,
    //                 }
    //               : {
    //                   title: item.title,
    //                 },
    //           ),
    //         },
    //       });
    //       let oldSpecialtiesOnSpecialtyItems = await prisma.specialtiesOnSpecialtyItems.findMany({
    //         where: { specialtyId },
    //       });
    //       await prisma.specialtiesOnSpecialtyItems.createMany({
    //         data: specialtyItems.map((item: SpecialtyItem) => ({
    //           specialtyId,
    //           specialtyItemId: item.id,
    //         })),
    //         skipDuplicates: true,
    //       });
    //       let newSpecialtiesOnSpecialtyItems = await prisma.specialtiesOnSpecialtyItems.findMany({
    //         where: {
    //           specialtyId,
    //           OR: specialtyItems.map((item: SpecialtyItem) => ({
    //             specialtyItemId: item.id,
    //           })),
    //         },
    //       });
    //       let diff = difference(oldSpecialtiesOnSpecialtyItems, newSpecialtiesOnSpecialtyItems);
    //       if (diff.length > 0) {
    //         await prisma.specialtiesOnSpecialtyItems.deleteMany({
    //           where: {
    //             OR: diff.map((item: SpecialtiesOnSpecialtyItems) => ({
    //               specialtyId,
    //               specialtyItemId: item.specialtyItemId,
    //             })),
    //           },
    //         });
    //       }
    //     }
    //     const newSpecialty: Prisma.SpecialtyUpdateInput = {
    //       title: ignoreUndefined(title, targetSpecialty?.title),
    //       type: ignoreUndefined(type, targetSpecialty?.type),
    //     };
    //     const specialty = await prisma.specialty.update({
    //       where: { id: specialtyId },
    //       data: newSpecialty,
    //       include: { items: true },
    //     });
    //     if (isEmpty(specialty) || specialty === null) {
    //       res.status(404).send({
    //         message: `${specialtyId} doesn't exist`,
    //         result: null,
    //       });
    //     } else {
    //       return res.status(200).send({
    //         message: 'successfully update a specialty',
    //         result: specialty,
    //       });
    //     }
    //   } catch (error) {
    //     next(error);
    //   }
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
}
