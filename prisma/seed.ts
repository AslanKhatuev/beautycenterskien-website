// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.booking.createMany({
    data: [
      {
        name: "Test Kunde",
        email: "test@example.com",
        phone: "12345678",
        serviceId: "1",
        serviceName: "Test Service",
        price: 500,
        startAt: new Date(),
      },
    ],
  });

  console.log("Seeding ferdig!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
