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
  const products = Array.from({ length: SEED_COUNT }).map((_, index) => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    sku: `SKU-${faker.string.alphanumeric({ length: 8 }).toUpperCase()}-${index}`,
    price: faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
    stock: faker.number.int({ min: 0, max: 500 }),
  }));

  const customers = Array.from({ length: SEED_COUNT }).map((_, index) => ({
    name: faker.person.fullName(),
    email: faker.internet.email({ lastName: `seed${index}` }).toLowerCase(),
    phone: faker.helpers.maybe(() => faker.phone.number(), {
      probability: 0.6,
    }),
  }));

  let totalCreated = 0;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const result = await prisma.product.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalCreated += result.count;
  }

  let totalCustomers = 0;
  for (let i = 0; i < customers.length; i += BATCH_SIZE) {
    const batch = customers.slice(i, i + BATCH_SIZE);
    const result = await prisma.customer.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalCustomers += result.count;
  }

  const allCustomers = await prisma.customer.findMany({
    select: { id: true },
  });
  const allProducts = await prisma.product.findMany({
    select: { id: true },
  });

  const saleCount = Math.max(5, Math.floor(SEED_COUNT / 2));
  const sales = Array.from({ length: saleCount }).map(() => {
    const customer =
      allCustomers[Math.floor(Math.random() * allCustomers.length)];
    const product =
      allProducts[Math.floor(Math.random() * allProducts.length)];
    return {
      customerId: customer.id,
      productId: product.id,
      quantity: faker.number.int({ min: 1, max: 5 }),
      saleDate: faker.date.recent({ days: 120 }),
    };
  });

  let totalSales = 0;
  for (let i = 0; i < sales.length; i += BATCH_SIZE) {
    const batch = sales.slice(i, i + BATCH_SIZE);
    const result = await prisma.sale.createMany({
      data: batch,
    });
    totalSales += result.count;
  }

  console.log(`Seeded ${totalCreated} products`);
  console.log(`Seeded ${totalCustomers} customers`);
  console.log(`Seeded ${totalSales} sales`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
