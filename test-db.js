// Last environment variabler
require("dotenv").config({ path: ".env.local" });

const path = require("path");
console.log("Current working directory:", process.cwd());
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("Absolute path to database:", path.resolve("./prisma/dev.db"));

const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");

    const count = await prisma.booking.count();
    console.log("✅ Booking count:", count);
  } catch (error) {
    console.error("❌ Database error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
