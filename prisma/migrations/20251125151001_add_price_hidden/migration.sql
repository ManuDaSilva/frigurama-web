-- AlterEnum
ALTER TYPE "public"."Operation" ADD VALUE 'compartir';

-- AlterTable
ALTER TABLE "public"."Listing" ADD COLUMN     "address" TEXT,
ADD COLUMN     "communityFees" INTEGER,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "priceHidden" BOOLEAN DEFAULT false,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "yearBuilt" INTEGER,
ADD COLUMN     "zip" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "type" DROP DEFAULT;
