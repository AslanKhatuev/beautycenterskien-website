const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function makeLocal(y, m0, d, hh, mm) {
  return new Date(y, m0, d, hh, mm, 0, 0);
}

async function main() {
  await prisma.booking.deleteMany();
  const now = new Date();
  const y = now.getFullYear();
  const m0 = now.getMonth();
  const d = now.getDate();
  await prisma.booking.createMany({
    data: [
      {
        name: "Test",
        email: "test@example.com",
        phone: "12345678",
        serviceId: "klassisk-massasje",
        serviceName: "Klassisk massasje",
        price: 750,
        startAt: makeLocal(y, m0, d, 10, 0),
      },
      {
        name: "Ola",
        email: "ola@example.com",
        phone: "87654321",
        serviceId: "sportsmassasje",
        serviceName: "Sportsmassasje",
        price: 800,
        startAt: makeLocal(y, m0, d, 13, 0),
      },
    ],
  });
  console.log("Seed complete");
}
main().finally(() => prisma.$disconnect());
