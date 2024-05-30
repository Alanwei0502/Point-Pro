import { SelectionType } from '@prisma/client';
import { z } from 'zod';

// CATEGORY
export const getCategoryByIdRequestSchema = z.object({
  categoryId: z.string(),
});

export const createCategoryRequestSchema = z.object({
  title: z.string(),
  position: z.number(),
});

export const updateCategoryRequestSchema = z.object({
  title: z.string(),
});

export const updateCategoryOrderRequestSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  }),
);

export const deleteCategoryRequestSchema = z.object({
  categoryId: z.string(),
});

// MEAL
export const updateMealOrderRequestSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  }),
);

export const createMealRequestSchema = z.object({
  title: z.string(),
  price: z.number(),
  imageId: z.string(),
  imageDeleteHash: z.string(),
  position: z.number(),
  isPopular: z.boolean(),
  description: z.string(),
  publishedAt: z.union([z.string(), z.null()]),
  categoryId: z.string(),
  specialtyItems: z.array(z.string()),
});

export const deleteMealRequestSchma = z.object({
  id: z.string(),
  imageDeleteHash: z.string(),
});

// SPECIALTY
export const getSpecialtyByIdRequestSchema = z.object({
  specialtyId: z.string(),
});

export const createSpecialtyRequestSchema = z.object({
  title: z.string(),
  selectionType: z.nativeEnum(SelectionType),
  position: z.number(),
});

export const updateSpecialtyRequestSchema = z.object({
  title: z.string(),
  selectionType: z.nativeEnum(SelectionType),
});

export const deleteSpecialtyRequestSchema = z.object({
  specialtyId: z.string(),
});

export const updateSpecialtyOrderRequestSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  }),
);

// SPECIALTY ITEM
export const createSpecialtyItemRequestSchema = z.object({
  title: z.string(),
  price: z.number(),
  position: z.number(),
  specialtyId: z.string(),
});

export const updateSpecialtyItemRequestSchema = z.object({
  title: z.string(),
  price: z.number(),
});

export const updateSpecialtyItemOrderRequestSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  }),
);

export const deleteSpecialtyItemRequestSchema = z.object({
  specialtyItemId: z.string(),
});
