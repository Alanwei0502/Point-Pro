import prisma from './client';

async function main() {
  const menu = await prisma.category.findMany({
    select: {
      id: true,
      title: true,
      position: true,
      meals: {
        where: {
          publishedAt: {
            lte: new Date(),
          },
        },
        orderBy: {
          position: 'asc',
        },
        include: {
          mealSpecialties: {
            include: {
              specialties: {
                include: {
                  specialtyItems: {
                    include: {
                      mealSpecialtyItems: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      position: 'asc',
    },
  });

  console.table(menu);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
