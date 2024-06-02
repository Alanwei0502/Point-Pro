-- DropForeignKey
ALTER TABLE "order_meal_specialties" DROP CONSTRAINT "order_meal_specialties_order_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "order_meal_specialties" DROP CONSTRAINT "order_meal_specialties_specialty_id_fkey";

-- DropForeignKey
ALTER TABLE "order_meal_specialty_items" DROP CONSTRAINT "order_meal_specialty_items_order_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "order_meal_specialty_items" DROP CONSTRAINT "order_meal_specialty_items_specialty_item_id_fkey";

-- DropForeignKey
ALTER TABLE "order_meals" DROP CONSTRAINT "order_meals_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "order_meals" DROP CONSTRAINT "order_meals_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "period_seats" DROP CONSTRAINT "period_seats_period_id_fkey";

-- DropForeignKey
ALTER TABLE "period_seats" DROP CONSTRAINT "period_seats_seat_id_fkey";

-- DropForeignKey
ALTER TABLE "reservation_period_seats" DROP CONSTRAINT "reservation_period_seats_period_id_seat_id_fkey";

-- DropForeignKey
ALTER TABLE "reservation_period_seats" DROP CONSTRAINT "reservation_period_seats_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_period_id_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_user_id_fkey";

-- AddForeignKey
ALTER TABLE "order_meal_specialties" ADD CONSTRAINT "order_meal_specialties_order_meal_id_fkey" FOREIGN KEY ("order_meal_id") REFERENCES "order_meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_meal_specialties" ADD CONSTRAINT "order_meal_specialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_meal_specialty_items" ADD CONSTRAINT "order_meal_specialty_items_order_meal_id_fkey" FOREIGN KEY ("order_meal_id") REFERENCES "order_meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_meal_specialty_items" ADD CONSTRAINT "order_meal_specialty_items_specialty_item_id_fkey" FOREIGN KEY ("specialty_item_id") REFERENCES "specialty_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_meals" ADD CONSTRAINT "order_meals_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_meals" ADD CONSTRAINT "order_meals_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "period_seats" ADD CONSTRAINT "period_seats_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "period_seats" ADD CONSTRAINT "period_seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_period_seats" ADD CONSTRAINT "reservation_period_seats_period_id_seat_id_fkey" FOREIGN KEY ("period_id", "seat_id") REFERENCES "period_seats"("period_id", "seat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_period_seats" ADD CONSTRAINT "reservation_period_seats_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
