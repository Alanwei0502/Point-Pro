import { prismaClient } from '../helpers';

export class SeatModel {
  static getSeats = async () => {
    const seats = await prismaClient.seat.findMany();
    return seats;
  };

  static getTotalSeatsNumber = async () => {
    const totalSeatsNumber = await prismaClient.seat.aggregate({
      _sum: {
        capacity: true,
      },
    });
    return totalSeatsNumber._sum.capacity as number;
  };
}
