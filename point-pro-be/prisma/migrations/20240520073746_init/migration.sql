-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "log_type" AS ENUM ('LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('WORKING', 'FINISHED', 'CANCEL');

-- CreateEnum
CREATE TYPE "order_type" AS ENUM ('DINE_IN', 'TAKE_OUT');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('UNPAID', 'SUCCESS', 'CANCEL');

-- CreateEnum
CREATE TYPE "reservation_type" AS ENUM ('ONLINE', 'PHONE');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('CUSTOMER', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "selection_type" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "slot_status" AS ENUM ('AVAILABLE', 'FULL', 'UNAVAILABLE');

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(50) NOT NULL,
    "position" SMALLINT DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_logs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "log_type" "log_type" DEFAULT 'LOGIN',
    "operation_time" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_specialties" (
    "meal_id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,

    CONSTRAINT "meal_specialties_pkey" PRIMARY KEY ("meal_id","specialty_id")
);

-- CreateTable
CREATE TABLE "meal_specialty_items" (
    "meal_id" UUID NOT NULL,
    "specialty_item_id" UUID NOT NULL,

    CONSTRAINT "meal_specialty_items_pkey" PRIMARY KEY ("meal_id","specialty_item_id")
);

-- CreateTable
CREATE TABLE "meals" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(50) NOT NULL,
    "cover_url" VARCHAR(255) DEFAULT '',
    "description" TEXT DEFAULT '',
    "is_popular" BOOLEAN DEFAULT false,
    "price" INTEGER DEFAULT 0,
    "position" SMALLINT DEFAULT 0,
    "published_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "category_id" UUID,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_meal_specialties" (
    "order_meal_id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,

    CONSTRAINT "order_meal_specialties_pkey" PRIMARY KEY ("order_meal_id","specialty_id")
);

-- CreateTable
CREATE TABLE "order_meal_specialty_items" (
    "order_meal_id" UUID NOT NULL,
    "specialty_item_id" UUID NOT NULL,

    CONSTRAINT "order_meal_specialty_items_pkey" PRIMARY KEY ("order_meal_id","specialty_item_id")
);

-- CreateTable
CREATE TABLE "order_meals" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "amount" SMALLINT NOT NULL,
    "served_amount" SMALLINT DEFAULT 0,
    "order_id" UUID NOT NULL,
    "meal_id" UUID NOT NULL,

    CONSTRAINT "order_meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "status" "order_status" DEFAULT 'WORKING',
    "type" "order_type" DEFAULT 'DINE_IN',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "walk_in_user_id" UUID,
    "user_id" UUID,
    "reservation_id" UUID,
    "payment_id" UUID,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "payment_no" TEXT,
    "price" INTEGER NOT NULL,
    "gateway" VARCHAR(50) NOT NULL,
    "status" "payment_status" DEFAULT 'UNPAID',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "period_seats" (
    "period_id" UUID NOT NULL,
    "seat_id" UUID NOT NULL,

    CONSTRAINT "period_seats_pkey" PRIMARY KEY ("period_id","seat_id")
);

-- CreateTable
CREATE TABLE "periods" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_period_seats" (
    "reservation_id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "seat_id" UUID NOT NULL,

    CONSTRAINT "reservation_period_seats_pkey" PRIMARY KEY ("reservation_id","period_id","seat_id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "reservation_type" DEFAULT 'ONLINE',
    "is_cancelled" BOOLEAN DEFAULT false,
    "people" SMALLINT DEFAULT 1,
    "start_at" TIMESTAMPTZ(6),
    "end_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "period_id" UUID NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "seat_no" VARCHAR(5) NOT NULL,
    "capacity" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialties" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(50) NOT NULL,
    "selection_type" "selection_type" DEFAULT 'SINGLE',
    "position" SMALLINT DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialty_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(50) NOT NULL,
    "price" INTEGER DEFAULT 0,
    "position" SMALLINT DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "specialty_id" UUID,

    CONSTRAINT "specialty_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100),
    "gender" "gender",
    "password_hash" VARCHAR(255),
    "role" "role" DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "walk_in_users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "people" SMALLINT DEFAULT 1,
    "start_at" TIMESTAMPTZ(6),
    "end_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "walk_in_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "meals_title_key" ON "meals"("title");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_no_key" ON "payments"("payment_no");

-- CreateIndex
CREATE UNIQUE INDEX "seats_seat_no_key" ON "seats"("seat_no");

-- CreateIndex
CREATE UNIQUE INDEX "specialties_title_key" ON "specialties"("title");

-- CreateIndex
CREATE UNIQUE INDEX "specialty_items_title_key" ON "specialty_items"("title");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "login_logs" ADD CONSTRAINT "login_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_specialties" ADD CONSTRAINT "meal_specialties_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_specialties" ADD CONSTRAINT "meal_specialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_specialty_items" ADD CONSTRAINT "meal_specialty_items_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_specialty_items" ADD CONSTRAINT "meal_specialty_items_specialty_item_id_fkey" FOREIGN KEY ("specialty_item_id") REFERENCES "specialty_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_meal_specialties" ADD CONSTRAINT "order_meal_specialties_order_meal_id_fkey" FOREIGN KEY ("order_meal_id") REFERENCES "order_meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_meal_specialties" ADD CONSTRAINT "order_meal_specialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_meal_specialty_items" ADD CONSTRAINT "order_meal_specialty_items_order_meal_id_fkey" FOREIGN KEY ("order_meal_id") REFERENCES "order_meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_meal_specialty_items" ADD CONSTRAINT "order_meal_specialty_items_specialty_item_id_fkey" FOREIGN KEY ("specialty_item_id") REFERENCES "specialty_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_meals" ADD CONSTRAINT "order_meals_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_meals" ADD CONSTRAINT "order_meals_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_walk_in_user_id_fkey" FOREIGN KEY ("walk_in_user_id") REFERENCES "walk_in_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "period_seats" ADD CONSTRAINT "period_seats_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "period_seats" ADD CONSTRAINT "period_seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation_period_seats" ADD CONSTRAINT "reservation_period_seats_period_id_seat_id_fkey" FOREIGN KEY ("period_id", "seat_id") REFERENCES "period_seats"("period_id", "seat_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation_period_seats" ADD CONSTRAINT "reservation_period_seats_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "specialty_items" ADD CONSTRAINT "specialty_items_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
