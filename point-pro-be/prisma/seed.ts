import prisma from './client';
import {
  insertCategories,
  insertMealSpecialties,
  insertMealSpecialtyItems,
  insertMeals,
  insertPeriodSeats,
  insertPeriods,
  insertReservationPeriodSeats,
  insertReservations,
  insertSeats,
  insertSpecialties,
  insertSpecialtyItems,
  insertUsers,
} from './seeders';

async function main() {
  try {
    console.log('seeding data...');
    try {
      console.log('seeding users...');
      await insertUsers();
    } catch (error) {
      console.log('error seeding users:', error);
    }

    try {
      console.log('seeding categories...');
      await insertCategories();
    } catch (error) {
      console.log('error seeding categories:', error);
    }

    try {
      console.log('seeding meals...');
      await insertMeals();
    } catch (error) {
      console.log('error seeding meals:', error);
    }

    try {
      console.log('seeding specialties...');
      await insertSpecialties();
    } catch (error) {
      console.log('error seeding specialties:', error);
    }

    try {
      console.log('seeding specialty items...');
      await insertSpecialtyItems();
    } catch (error) {
      console.log('error seeding specialty items:', error);
    }

    try {
      console.log('seeding meal specialties...');
      await insertMealSpecialties();
    } catch (error) {
      console.log('error seeding meal specialties:', error);
    }

    try {
      console.log('seeding meal specialty items...');
      await insertMealSpecialtyItems();
    } catch (error) {
      console.log('error seeding meal specialty items:', error);
    }

    try {
      console.log('seeding periods...');
      await insertPeriods();
    } catch (error) {
      console.log('error seeding periods:', error);
    }

    try {
      console.log('seeding seats...');
      await insertSeats();
    } catch (error) {
      console.log('error seeding seats:', error);
    }

    try {
      console.log('seeding period seats...');
      await insertPeriodSeats();
    } catch (error) {
      console.log('error seeding period seats:', error);
    }

    try {
      console.log('seeding reservations...');
      await insertReservations();
    } catch (error) {
      console.log('error seeding reservations:', error);
    }

    try {
      console.log('seeding reservation period seats...');
      await insertReservationPeriodSeats();
    } catch (error) {
      console.log('error seeding reservation period seats:', error);
    }

    console.log('data seeded successfully');
    await prisma.$disconnect();
  } catch (error) {
    console.log('error seeding data:', error);
    await prisma.$disconnect();
  }
}

main();
