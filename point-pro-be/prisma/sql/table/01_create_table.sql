DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET
  TIME ZONE 'Asia/Taipei';

CREATE TYPE "role" AS ENUM('CUSTOMER', 'STAFF', 'ADMIN');

CREATE TYPE "gender" AS ENUM('MALE', 'FEMALE', 'OTHER');

CREATE TYPE "log_type" AS ENUM('LOGIN', 'LOGOUT');

CREATE TYPE "selection_type" AS ENUM('SINGLE', 'MULTIPLE');

CREATE TYPE "order_status" AS ENUM('WORKING', 'FINISHED', 'CANCEL');

CREATE TYPE "order_type" AS ENUM('DINE_IN', 'TAKE_OUT');

CREATE TYPE "payment_status" AS ENUM('UNPAID', 'SUCCESS', 'CANCEL');

CREATE TYPE "reservation_type" AS ENUM('ONLINE', 'PHONE');

CREATE TYPE "slot_status" AS ENUM('AVAILABLE', 'FULL', 'UNAVAILABLE');

CREATE TABLE
  "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "username" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) UNIQUE NOT NULL,
    "email" VARCHAR(100) UNIQUE,
    "gender" gender,
    "password_hash" VARCHAR(255),
    "role" ROLE DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CHECK (
      (
        "role" = 'STAFF' AND
        "email" IS NOT NULL
      ) OR
      (
        "role" = 'ADMIN' AND
        "email" IS NOT NULL
      ) OR
      ("role" = 'CUSTOMER')
    )
  );

CREATE TABLE
  "walk_in_users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "people" SMALLINT DEFAULT 1 CHECK ("people" > 0),
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CHECK ("start_at" < "end_at")
  );

CREATE TABLE
  "login_logs" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "log_type" log_type DEFAULT 'LOGIN' CHECK ("log_type" IN ('LOGIN', 'LOGOUT')),
    "operation_time" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
  );

CREATE TABLE
  "categories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "title" VARCHAR(50) UNIQUE NOT NULL,
    "position" SMALLINT DEFAULT 0 CHECK ("position" >= 0),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  "meals" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "title" VARCHAR(50) UNIQUE NOT NULL,
    "cover_url" VARCHAR(255) DEFAULT '',
    "description" TEXT DEFAULT '',
    "is_popular" BOOLEAN DEFAULT FALSE,
    "price" INTEGER DEFAULT 0 CHECK ("price" >= 0),
    "position" SMALLINT DEFAULT 0 CHECK ("position" >= 0),
    "published_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "category_id" UUID REFERENCES "categories" ("id") ON DELETE SET NULL
  );

CREATE TABLE
  "specialties" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "title" VARCHAR(50) UNIQUE NOT NULL,
    "selection_type" selection_type DEFAULT 'SINGLE' CHECK ("selection_type" IN ('SINGLE', 'MULTIPLE')),
    "position" SMALLINT DEFAULT 0 CHECK ("position" >= 0),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  "specialty_items" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "title" VARCHAR(50) UNIQUE NOT NULL,
    "price" INTEGER DEFAULT 0 CHECK ("price" >= 0),
    "position" SMALLINT DEFAULT 0 CHECK ("position" >= 0),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "specialty_id" UUID REFERENCES "specialties" ("id") ON DELETE SET NULL
  );

CREATE TABLE
  "meal_specialties" (
    "meal_id" UUID NOT NULL REFERENCES "meals" ("id") ON DELETE CASCADE,
    "specialty_id" UUID NOT NULL REFERENCES "specialties" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("meal_id", "specialty_id")
  );

CREATE TABLE
  "meal_specialty_items" (
    "meal_id" UUID NOT NULL REFERENCES "meals" ("id") ON DELETE CASCADE,
    "specialty_item_id" UUID NOT NULL REFERENCES "specialty_items" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("meal_id", "specialty_item_id")
  );

CREATE TABLE
  "payments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "payment_no" TEXT UNIQUE,
    "price" INTEGER NOT NULL CHECK ("price" >= 0),
    "gateway" VARCHAR(50) NOT NULL,
    "status" payment_status DEFAULT 'UNPAID' CHECK ("status" IN ('UNPAID', 'SUCCESS', 'CANCEL')),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  "periods" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CHECK ("start_time" + INTERVAL '2 hour' = "end_time")
  );

CREATE TABLE
  "reservations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "type" reservation_type DEFAULT 'ONLINE' CHECK ("type" IN ('ONLINE', 'PHONE')),
    "is_cancelled" BOOLEAN DEFAULT FALSE,
    "people" SMALLINT DEFAULT 1 CHECK ("people" > 0),
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "period_id" UUID NOT NULL REFERENCES "periods" ("id") ON DELETE CASCADE,
    CHECK ("start_at" < "end_at")
  );

CREATE TABLE
  "seats" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "seat_no" VARCHAR(5) UNIQUE NOT NULL,
    "capacity" SMALLINT NOT NULL CHECK ("capacity" > 0),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  "period_seats" (
    "period_id" UUID REFERENCES "periods" ("id") ON DELETE CASCADE,
    "seat_id" UUID REFERENCES "seats" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("period_id", "seat_id")
  );

CREATE TABLE
  "reservation_period_seats" (
    "reservation_id" UUID NOT NULL REFERENCES "reservations" ("id") ON DELETE CASCADE,
    "period_id" UUID NOT NULL,
    "seat_id" UUID NOT NULL,
    PRIMARY KEY ("reservation_id", "period_id", "seat_id"),
    FOREIGN KEY ("period_id", "seat_id") REFERENCES "period_seats" ("period_id", "seat_id") ON DELETE CASCADE
  );

CREATE TABLE
  "orders" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "status" order_status DEFAULT 'WORKING' CHECK ("status" IN ('WORKING', 'FINISHED', 'CANCEL')),
    "type" order_type DEFAULT 'DINE_IN' CHECK ("type" IN ('DINE_IN', 'TAKE_OUT')),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "reservation_id" UUID REFERENCES "reservations" ("id") ON DELETE SET NULL,
    "payment_id" UUID REFERENCES "payments" ("id") ON DELETE SET NULL,
  );

CREATE TABLE
  "order_meals" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "amount" SMALLINT NOT NULL CHECK ("amount" > 0),
    "served_amount" SMALLINT DEFAULT 0 CHECK (
      "served_amount" >= 0 AND
      "served_amount" <= "amount"
    ),
    "order_id" UUID NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
    "meal_id" UUID NOT NULL REFERENCES "meals" ("id") ON DELETE CASCADE
  );

CREATE TABLE
  "order_meal_specialties" (
    "order_meal_id" UUID NOT NULL REFERENCES "order_meals" ("id") ON DELETE CASCADE,
    "specialty_id" UUID NOT NULL REFERENCES "specialties" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("order_meal_id", "specialty_id")
  );

CREATE TABLE
  "order_meal_specialty_items" (
    "order_meal_id" UUID NOT NULL REFERENCES "order_meals" ("id") ON DELETE CASCADE,
    "specialty_item_id" UUID NOT NULL REFERENCES "specialty_items" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("order_meal_id", "specialty_item_id")
  );