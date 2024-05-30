/*
  Warnings:

  - Made the column `image_delete_hash` on table `meals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "meals" ALTER COLUMN "image_delete_hash" SET NOT NULL;
