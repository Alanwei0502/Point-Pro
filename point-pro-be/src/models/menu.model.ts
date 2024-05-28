import { SelectionType } from '@prisma/client';
import { prisma } from '../helpers';
import { updateCategoriesOrderRequestSchema } from '../validators';
import { z } from 'zod';

const getCustomerCategories = async () => {
  const categories = await prisma.category.findMany({
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

const getCustomerMeals = async () => {
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

  return meals;
};

const getCustomerSpecialtiesWithItems = async () => {
  const specialtiesWithItems = await prisma.specialty.findMany({
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

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      position: 'asc',
    },
  });

  return categories;
};

const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  return category;
};

const createCategory = async (title: string, position?: number) => {
  const category = await prisma.category.create({
    data: {
      title,
      position,
    },
  });

  return category;
};

const updateCateogry = async (categoryId: string, title: string) => {
  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      title,
    },
  });
};

const deleteCategoryById = async (categoryId: string) => {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

const updateCategoriesOrder = async (categories: z.infer<typeof updateCategoriesOrderRequestSchema>) => {
  const updatePromises = categories.map((c) => {
    return prisma.category.update({
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

const getMealsWithCategoryAndSpecialtyItems = async () => {
  const meals = await prisma.meal.findMany({
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

const getSpecialtiesWithItems = async () => {
  const specialtiesWithItems = await prisma.specialty.findMany({
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

const getSpecialtyById = async (specialtyId: string) => {
  const specialty = await prisma.specialty.findUnique({
    where: {
      id: specialtyId,
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

const getSpecialtyItems = async () => {
  const specialtyItems = await prisma.specialtyItem.findMany({
    orderBy: {
      position: 'asc',
    },
  });

  return specialtyItems;
};

const createSpecialty = async (title: string, selectionType: SelectionType, position?: number) => {
  const specialty = await prisma.specialty.create({
    data: {
      title,
      selectionType,
      position,
    },
  });

  return specialty;
};

const updateSpecialty = async (specialtyId: string, title?: string, selectionType?: SelectionType, position?: number) => {
  await prisma.specialty.update({
    where: {
      id: specialtyId,
    },
    data: {
      title,
      selectionType,
      position,
    },
  });
};

const deleteSpecialtyById = async (specialtyId: string) => {
  await prisma.specialty.delete({
    where: {
      id: specialtyId,
    },
  });
};

export const MenuModel = {
  getCustomerCategories,
  getCustomerMeals,
  getCustomerSpecialtiesWithItems,
  getCategories,
  getCategoryById,
  createCategory,
  updateCateogry,
  updateCategoriesOrder,
  deleteCategoryById,
  getSpecialtiesWithItems,
  getSpecialtyById,
  getSpecialtyItems,
  createSpecialty,
  updateSpecialty,
  deleteSpecialtyById,
  getMealsWithCategoryAndSpecialtyItems,
};
