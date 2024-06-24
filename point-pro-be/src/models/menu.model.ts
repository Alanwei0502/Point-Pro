import { Category, Meal, SelectionType, Specialty, SpecialtyItem } from '@prisma/client';
import { z } from 'zod';
import { prismaClient } from '../helpers';
import {
  createSpecialtyItemRequestSchema,
  createSpecialtyRequestSchema,
  updateCategoryOrderRequestSchema,
  updateSpecialtyOrderRequestSchema,
  updateSpecialtyItemOrderRequestSchema,
  updateMealOrderRequestSchema,
  createMealRequestSchema,
  updateMealRequestSchema,
} from '../validators';

export class MenuModel {
  // CUSTOMER MENU
  static getCustomerCategories = async () => {
    const categories = await prismaClient.category.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return categories;
  };

  static getCustomerMeals = async () => {
    const meals = await prismaClient.meal.findMany({
      select: {
        id: true,
        title: true,
        imageId: true,
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
      orderBy: {
        position: 'asc',
      },
    });

    return meals;
  };

  static getCustomerSpecialtiesWithItems = async () => {
    const specialtiesWithItems = await prismaClient.specialty.findMany({
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

    return specialtiesWithItems;
  };

  // CATEGORY
  static getCategoryById = async (id: Category['id']) => {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    });

    return category;
  };

  static getCategories = async () => {
    const categories = await prismaClient.category.findMany({
      orderBy: {
        position: 'asc',
      },
    });

    return categories;
  };

  static createCategory = async (title: Category['title'], position: Category['position']) => {
    const category = await prismaClient.category.create({
      data: {
        title,
        position,
      },
    });

    return category;
  };

  static updateCateogry = async (id: Category['id'], title: Category['title']) => {
    await prismaClient.category.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
  };

  static deleteCategoryById = async (id: Category['id']) => {
    await prismaClient.category.delete({
      where: {
        id,
      },
    });
  };

  static updateCategoriesOrder = async (categories: z.infer<typeof updateCategoryOrderRequestSchema>) => {
    const updatePromises = categories.map((c) => {
      return prismaClient.category.update({
        where: {
          id: c.id,
        },
        data: {
          position: c.position,
        },
      });
    });

    await Promise.all(updatePromises);
  };

  // MEAL
  static getMealById = async (id: Meal['id']) => {
    const meal = await prismaClient.meal.findUnique({
      where: {
        id,
      },
    });

    return meal;
  };

  static getMealsDeleteHashesByCategoryId = async (categoryId: Category['id']) => {
    const meals = await prismaClient.meal.findMany({
      select: {
        imageDeleteHash: true,
      },
      where: {
        categoryId,
      },
    });

    return meals;
  };

  static getMealsWithCategoryAndSpecialtyItems = async () => {
    const meals = await prismaClient.meal.findMany({
      include: {
        categories: true,
        mealSpecialtyItems: {
          select: {
            specialtyItems: true,
          },
          orderBy: {
            specialtyItems: {
              position: 'asc',
            },
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    const result = meals.map((m) => {
      const { mealSpecialtyItems, ...rest } = m;
      return {
        ...rest,
        specialtyItems: m.mealSpecialtyItems.map((msi) => msi.specialtyItems),
      };
    });

    return result;
  };

  static createMeal = async (data: z.infer<typeof createMealRequestSchema>) => {
    const { specialtyItems, ...rest } = data;
    const specialties = await prismaClient.specialtyItem.findMany({
      select: {
        specialtyId: true,
      },
      where: {
        id: {
          in: specialtyItems,
        },
      },
      distinct: ['specialtyId'],
    });
    const meal = await prismaClient.meal.create({
      data: {
        ...rest,
        mealSpecialties: {
          createMany: {
            data: specialties,
          },
        },
        mealSpecialtyItems: {
          createMany: {
            data: specialtyItems.map((si) => ({
              specialtyItemId: si,
            })),
          },
        },
      },
    });
    return meal;
  };

  static updateMeal = async (id: Meal['id'], meal: z.infer<typeof updateMealRequestSchema>) => {
    const { specialtyItems, ...rest } = meal;
    const specialties = await prismaClient.specialtyItem.findMany({
      select: {
        specialtyId: true,
      },
      where: {
        id: {
          in: specialtyItems,
        },
      },
      distinct: ['specialtyId'],
    });

    await prismaClient.meal.update({
      where: {
        id,
      },
      data: {
        ...rest,
        mealSpecialties: {
          deleteMany: {},
          createMany: {
            data: specialties,
          },
        },
        mealSpecialtyItems: {
          deleteMany: {},
          createMany: {
            data: specialtyItems.map((si) => ({
              specialtyItemId: si,
            })),
          },
        },
      },
    });
  };

  static updateMealsOrder = async (meals: z.infer<typeof updateMealOrderRequestSchema>) => {
    const updatePromises = meals.map((m) => {
      return prismaClient.meal.update({
        where: {
          id: m.id,
        },
        data: {
          position: m.position,
        },
      });
    });

    await Promise.all(updatePromises);
  };

  static deleteMealById = async (id: Meal['id']) => {
    await prismaClient.meal.delete({
      where: {
        id,
      },
    });
  };

  // SPECIALTY
  static getSpecialtiesWithItems = async () => {
    const specialtiesWithItems = await prismaClient.specialty.findMany({
      include: {
        specialtyItems: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    return specialtiesWithItems;
  };

  static getSpecialtyById = async (id: Specialty['id']) => {
    const specialty = await prismaClient.specialty.findUnique({
      where: {
        id,
      },
      include: {
        specialtyItems: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    return specialty;
  };

  static createSpecialty = async (data: z.infer<typeof createSpecialtyRequestSchema>) => {
    const specialty = await prismaClient.specialty.create({ data });
    return specialty;
  };

  static updateSpecialty = async (id: Specialty['id'], title: Specialty['title'], selectionType: SelectionType) => {
    await prismaClient.specialty.update({
      where: {
        id,
      },
      data: {
        title,
        selectionType,
      },
    });
  };

  static deleteSpecialtyById = async (id: Specialty['id']) => {
    await prismaClient.specialty.delete({
      where: {
        id,
      },
    });
  };

  static updateSpecialtiesOrder = async (specialties: z.infer<typeof updateSpecialtyOrderRequestSchema>) => {
    const updatePromises = specialties.map((s) => {
      return prismaClient.specialty.update({
        where: {
          id: s.id,
        },
        data: {
          position: s.position,
        },
      });
    });

    await Promise.all(updatePromises);
  };

  // SPECIALTY ITEM
  static getSpecialtyItems = async () => {
    const specialtyItems = await prismaClient.specialtyItem.findMany({
      orderBy: {
        position: 'asc',
      },
    });

    return specialtyItems;
  };

  static createSpecialtyItem = async (data: z.infer<typeof createSpecialtyItemRequestSchema>) => {
    const specialtyItem = await prismaClient.specialtyItem.create({ data });
    return specialtyItem;
  };

  static getSpecialtyItemById = async (id: SpecialtyItem['id']) => {
    const specialtyItem = await prismaClient.specialtyItem.findUnique({
      where: {
        id,
      },
    });

    return specialtyItem;
  };

  static updateSpecialtyItem = async (id: SpecialtyItem['id'], title: SpecialtyItem['title'], price: SpecialtyItem['price']) => {
    await prismaClient.specialtyItem.update({
      where: {
        id,
      },
      data: {
        title,
        price,
      },
    });
  };

  static updateSpecialtyItemsOrder = async (specialtyItems: z.infer<typeof updateSpecialtyItemOrderRequestSchema>) => {
    const updatePromises = specialtyItems.map((si) => {
      return prismaClient.specialtyItem.update({
        where: {
          id: si.id,
        },
        data: {
          position: si.position,
        },
      });
    });

    await Promise.all(updatePromises);
  };

  static deleteSpecialtyItemById = async (id: SpecialtyItem['id']) => {
    await prismaClient.specialtyItem.delete({
      where: {
        id,
      },
    });
  };
}
