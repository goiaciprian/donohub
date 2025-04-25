import { PrismaClient } from '@prisma/client';

const prisamClient = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const categories: string[] = [
    "Imbracaminte",
    "Incaltaminte",
    "Mobilier",
    "Electrocasnice",
    "Papetarie",
];

async function seedCategories() {
  await prisamClient.category.createMany({
    skipDuplicates: true,
    data: categories.map((c) => ({
      name: c,
    })),
  });
}

async function main() {
  console.log('started seeding ...');
  await seedCategories();
}

main().then(() => console.log('done seeding.'));
