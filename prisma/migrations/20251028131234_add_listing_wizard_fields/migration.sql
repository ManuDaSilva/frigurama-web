-- AlterTable
ALTER TABLE "public"."Listing" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "extras" JSONB,
ADD COLUMN     "reference" TEXT;
