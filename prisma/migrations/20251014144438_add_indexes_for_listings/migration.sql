-- CreateIndex
CREATE INDEX "Listing_createdAt_idx" ON "public"."Listing"("createdAt");

-- CreateIndex
CREATE INDEX "Listing_price_idx" ON "public"."Listing"("price");

-- CreateIndex
CREATE INDEX "Listing_city_idx" ON "public"."Listing"("city");

-- CreateIndex
CREATE INDEX "Listing_bedrooms_idx" ON "public"."Listing"("bedrooms");

-- CreateIndex
CREATE INDEX "Listing_bathrooms_idx" ON "public"."Listing"("bathrooms");

-- CreateIndex
CREATE INDEX "Listing_areaM2_idx" ON "public"."Listing"("areaM2");
