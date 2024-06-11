/*
  Warnings:

  - The values [CUSTOMER] on the enum `role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `user_id` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the `walk_in_users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `phone` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Made the column `password_hash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "role_new" AS ENUM ('STAFF', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "role_new" USING ("role"::text::"role_new");
ALTER TYPE "role" RENAME TO "role_old";
ALTER TYPE "role_new" RENAME TO "role";
DROP TYPE "role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STAFF';
COMMIT;

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_user_id_fkey";

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "user_id",
ADD COLUMN     "email" VARCHAR(100),
ADD COLUMN     "gender" "gender" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "phone" VARCHAR(20) NOT NULL,
ADD COLUMN     "username" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'STAFF';

-- DropTable
DROP TABLE "walk_in_users";
