import { SelectionType, Category } from '@prisma/client';
import { z } from 'zod';

export const getCategoryByIdRequestSchema = z.object({
  categoryId: z.string(),
});

export const createCategoryRequestSchema = z.object({
  title: z.string(),
  position: z.number().optional(),
});

export const updateCategoryRequestSchema = z.object({
  title: z.string(),
});

export const updateCategoriesOrderRequestSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  }),
);

export const deleteCategoryRequestSchema = z.object({
  categoryId: z.string(),
});

export const getSpecialtyByIdRequestSchema = z.object({
  specialtyId: z.string(),
});

export const createSpecialtyRequestSchema = z.object({
  title: z.string(),
  selectionType: z.nativeEnum(SelectionType),
  position: z.number(),
});

export const updateSpecialtyRequestSchema = z.object({
  title: z.string().optional(),
  selectionType: z.nativeEnum(SelectionType).optional(),
  position: z.number().optional(),
});

export const deleteSpecialtyRequestSchema = z.object({
  specialtyId: z.string(),
});

export const updateSpecialtiesOrderRequestSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  }),
);
