/*
  Warnings:

  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `walk_in_user_id` on the `orders` table. All the data in the column will be lost.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_walk_in_user_id_fkey";

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "login_logs" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "operation_time" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "meals" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "published_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "order_meals" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc();

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "user_id",
DROP COLUMN "walk_in_user_id",
ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "periods" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "start_time" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "end_time" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "reservations" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "start_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "end_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "seats" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "specialties" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "specialty_items" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "walk_in_users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v1mc(),
ALTER COLUMN "start_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "end_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);
