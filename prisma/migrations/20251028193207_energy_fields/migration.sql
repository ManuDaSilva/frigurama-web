-- AlterTable
ALTER TABLE "public"."Listing" ADD COLUMN     "energyConsumption" INTEGER,
ADD COLUMN     "energyEmissions" INTEGER,
ADD COLUMN     "energyLabel" TEXT;
