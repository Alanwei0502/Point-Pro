/*
  Warnings:

  - The values [SUCCESS] on the enum `payment_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `category_id` on table `meals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialty_id` on table `specialty_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "payment_status_new" AS ENUM ('UNPAID', 'PAID', 'CANCEL');
ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "payment_status_new" USING ("status"::text::"payment_status_new");
ALTER TYPE "payment_status" RENAME TO "payment_status_old";
ALTER TYPE "payment_status_new" RENAME TO "payment_status";
DROP TYPE "payment_status_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
COMMIT;

-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_category_id_fkey";

-- DropForeignKey
ALTER TABLE "specialty_items" DROP CONSTRAINT "specialty_items_specialty_id_fkey";

-- AlterTable
ALTER TABLE "meals" ALTER COLUMN "category_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "specialty_items" ALTER COLUMN "specialty_id" SET NOT NULL;

-- DropEnum
DROP TYPE "slot_status";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "specialty_items" ADD CONSTRAINT "specialty_items_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
