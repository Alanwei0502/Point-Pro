/*
  Warnings:

  - You are about to drop the `order_meal_specialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_meal_specialties" DROP CONSTRAINT "order_meal_specialties_order_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "order_meal_specialties" DROP CONSTRAINT "order_meal_specialties_specialty_id_fkey";

-- DropTable
DROP TABLE "order_meal_specialties";
