import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.listing.createMany({
    data: [
      {
        title: "Piso en Vallecas",
        price: 120000,
        city: "Madrid",
        bedrooms: 2,
        bathrooms: 1,
        areaM2: 65,
        description: "Un piso luminoso en el centro de Vallecas",
        operation: "venta",
        type: "Piso"
      },
      {
        title: "Ático en Eixample",
        price: 420000,
        city: "Barcelona",
        bedrooms: 3,
        bathrooms: 2,
        areaM2: 110,
        description: "Ático con terraza en pleno Eixample",
        operation: "venta",
        type: "Atico"
      },
      {
        title: "Estudio céntrico",
        price: 85000,
        city: "Valencia",
        bedrooms: 0,
        bathrooms: 1,
        areaM2: 35,
        description: "Estudio reformado ideal para inversión",
        operation: "venta",
        type: "Estudio"
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
