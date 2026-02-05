-- CreateEnum
CREATE TYPE "public"."Operation" AS ENUM ('venta', 'alquiler');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('Piso', 'Casa', 'Chalet', 'Atico', 'Estudio', 'Local', 'Parcela', 'Otro');

-- AlterTable
ALTER TABLE "public"."Listing" ADD COLUMN     "operation" "public"."Operation" DEFAULT 'venta',
ADD COLUMN     "type" "public"."PropertyType" DEFAULT 'Piso';
