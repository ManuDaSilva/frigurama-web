/**
 * Superadmin bootstrap seed.
 *
 * Safe for transitional state:
 *   - Looks up the existing admin by username OR email (whichever matches).
 *   - If found: assigns username + superadmin role. Password NOT touched.
 *   - If not found: creates the superadmin fresh from .env.
 *
 * To explicitly rotate the superadmin password, run:
 *   npx prisma db seed -- --reset-password
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Superadmin bootstrap ────────────────────────────────────────────────────
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const email    = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? null;
  const name     = process.env.ADMIN_NAME?.trim() ?? null;

  if (!username || !password) {
    throw new Error(
      "ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env before running the seed."
    );
  }

  const resetPassword = process.argv.includes("--reset-password");

  // Find existing user by username OR email — handles both fresh and
  // transitional installs (where the row exists but username is still null).
  const orConditions: object[] = [];
  if (username) orConditions.push({ username });
  if (email)    orConditions.push({ email });

  const existing = await prisma.user.findFirst({
    where: { OR: orConditions },
  });

  if (existing) {
    const updateData: Record<string, unknown> = {
      username,
      role: "superadmin",
      ...(email ? { email } : {}),
      ...(name  ? { name  } : {}),
    };

    if (resetPassword) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
      console.log(`⚠  Password reset requested for superadmin "${username}".`);
    }

    await prisma.user.update({ where: { id: existing.id }, data: updateData });
    console.log(
      `✓  Superadmin "${username}" configured — role enforced, password ${resetPassword ? "reset" : "unchanged"}.`
    );
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { username, email, name, passwordHash, role: "superadmin" },
    });
    console.log(`✓  Superadmin "${username}" created.`);
  }

  // ── Default site content ────────────────────────────────────────────────────
  await prisma.siteContent.upsert({
    where: { section: "contacto" },
    update: {},
    create: {
      section: "contacto",
      content: {
        heading: "Mantente\nen contacto",
        lines: [
          "Propósito que guía",
          "Estrategia que ordena",
          "Equipo que cumple",
          "Espacios que impulsan tu crecimiento.",
        ],
        image: "/images/contacto.jpg",
        ctaText: "HAZ TU CONSULTA AQUÍ",
        phone: "934763494",
        email: "info@frigurama.com",
        address: "08036. Muntaner, 0200",
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { section: "proyectos" },
    update: {},
    create: {
      section: "proyectos",
      content: {
        body: "<h1>Proyectos</h1><p>Próximamente.</p>",
      },
    },
  });

  console.log("Default site content ready.");

  // ── Sample listings (development only) ──────────────────────────────────────
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
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
