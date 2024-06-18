/*
  Warnings:

  - The `gateway` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "payment_gateway" AS ENUM ('CASH', 'LINE_PAY');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gateway",
ADD COLUMN     "gateway" "payment_gateway" NOT NULL DEFAULT 'CASH';
