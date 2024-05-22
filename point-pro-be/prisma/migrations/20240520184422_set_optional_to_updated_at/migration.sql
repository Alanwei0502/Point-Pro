-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "meals" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "periods" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reservations" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "seats" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "specialties" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "specialty_items" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "walk_in_users" ALTER COLUMN "updated_at" DROP NOT NULL;
