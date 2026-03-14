import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────────
  const email    = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file before running the seed."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where:  { email },
    update: { passwordHash },
    create: { email, passwordHash, role: "admin" },
  });

  console.log(`Admin user ready: ${admin.email} (id: ${admin.id})`);

  // ── Sample listings (development only) ──────────────────
  await prisma.listing.createMany({
    data: [
      {
        title:       "Piso en Vallecas",
        price:       120000,
        city:        "Madrid",
        bedrooms:    2,
        bathrooms:   1,
        areaM2:      65,
        description: "Un piso luminoso en el centro de Vallecas",
        operation:   "venta",
        type:        "Piso",
      },
      {
        title:       "Ático en Eixample",
        price:       420000,
        city:        "Barcelona",
        bedrooms:    3,
        bathrooms:   2,
        areaM2:      110,
        description: "Ático con terraza en pleno Eixample",
        operation:   "venta",
        type:        "Atico",
      },
      {
        title:       "Estudio céntrico",
        price:       85000,
        city:        "Valencia",
        bedrooms:    0,
        bathrooms:   1,
        areaM2:      35,
        description: "Estudio reformado ideal para inversión",
        operation:   "venta",
        type:        "Estudio",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Sample listings ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
