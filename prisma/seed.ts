import "dotenv/config";
import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SEED_COUNT = Number(process.env.SEED_COUNT ?? "100");
const BATCH_SIZE = Number(process.env.SEED_BATCH_SIZE ?? "20");

async function main() {
  const customers = Array.from({ length: SEED_COUNT }).map((_, index) => ({
    name: faker.person.fullName(),
    email: faker.internet.email({ lastName: `seed${index}` }).toLowerCase(),
    phone: faker.helpers.maybe(() => faker.phone.number(), {
      probability: 0.6,
    }),
  }));

  let totalCreated = 0;
  for (let i = 0; i < customers.length; i += BATCH_SIZE) {
    const batch = customers.slice(i, i + BATCH_SIZE);
    const result = await prisma.customer.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalCreated += result.count;
  }

  console.log(`Seeded ${totalCreated} customers`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
