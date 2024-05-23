import { prisma } from '../helpers';

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

export const MenuModel = {
  getCustomerCategories,
  getCustomerMeals,
  getCustomerSpecialtiesWithItems,
};
