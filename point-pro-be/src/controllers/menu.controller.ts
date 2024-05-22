import { SpecialtyItem } from '@prisma/client';
import { RequestHandler } from 'express';
import { ApiResponse } from '../types/shared';
import { prisma } from '../helpers';

export class MenuController {
  public static getMenuHandler: RequestHandler = async (req, res: ApiResponse, next) => {
    try {
      // const menu = await prisma.category.findMany({
      //   select: {
      //     id: true,
      //     title: true,
      //     meals: {
      //       where: {
      //         publishedAt: {
      //           lte: new Date(),
      //         },
      //       },
      //       select: {
      //         id: true,
      //         title: true,
      //         coverUrl: true,
      //         description: true,
      //         isPopular: true,
      //         price: true,
      //         mealSpecialties: {
      //           select: {
      //             specialties: {
      //               select: {
      //                 id: true,
      //                 title: true,
      //                 selectionType: true,
      //               },
      //             },
      //           },
      //           orderBy: {
      //             specialties: {
      //               position: 'asc',
      //             },
      //           },
      //         },
      //         mealSpecialtyItems: {
      //           select: {
      //             specialtyItems: {
      //               select: {
      //                 id: true,
      //                 title: true,
      //                 price: true,
      //                 specialties: {
      //                   select: {
      //                     title: true,
      //                   },
      //                 },
      //               },
      //             },
      //           },
      //           orderBy: {
      //             specialtyItems: {
      //               position: 'asc',
      //             },
      //           },
      //         },
      //       },
      //       orderBy: {
      //         position: 'asc',
      //       },
      //     },
      //   },
      //   orderBy: {
      //     position: 'asc',
      //   },
      // });

      // const categories
      // const result = menu.map((c) => ({}));

      // const result = menu.map((category) => ({
      //   ...category,
      //   meals: category.meals.map(({ meal }) => ({
      //     ...meal,
      //     categories: meal.categories.map(({ category }) => ({ ...category })),
      //     specialties: meal.specialties.map(({ specialty }) => ({
      //       ...specialty,
      //       items: specialty.items.map((item) => ({ ...item.specialtyItem })),
      //     })),
      //   })),
      // }));

      const categories = await prisma.category.findMany({
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          position: 'asc',
        },
      });

      const meals = await prisma.meal.findMany({
        select: {
          id: true,
          title: true,
          coverUrl: true,
          description: true,
          isPopular: true,
          price: true,
          categoryId: true,
          mealSpecialtyItems: {
            select: {
              specialtyItemId: true,
            },
          },
        },
        where: {
          publishedAt: {
            lte: new Date(),
          },
        },
      });

      const specialties = await prisma.specialty.findMany({
        select: {
          id: true,
          title: true,
          selectionType: true,
          specialtyItems: {
            select: {
              id: true,
              title: true,
              price: true,
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      });

      return res.status(200).send({
        message: 'success',
        result: {
          categories,
          meals,
          specialties,
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
