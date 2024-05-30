/*
  Warnings:

  - You are about to drop the column `cover_url` on the `meals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_category_id_fkey";

-- DropForeignKey
ALTER TABLE "specialty_items" DROP CONSTRAINT "specialty_items_specialty_id_fkey";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "cover_url",
ADD COLUMN     "image_delete_hash" VARCHAR(50) DEFAULT '',
ADD COLUMN     "image_id" VARCHAR(50) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialty_items" ADD CONSTRAINT "specialty_items_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
