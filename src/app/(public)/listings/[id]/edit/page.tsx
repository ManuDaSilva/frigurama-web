import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EditListingForm from "./EditListingForm";

export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!listing) notFound();

  // Pass only serialisable fields to the client component (no Date objects)
  const initial = {
    id: listing.id,
    status:       listing.status,
    title:        listing.title,
    description:  listing.description,
    address:      listing.address,
    city:         listing.city,
    province:     listing.province,
    zip:          listing.zip,
    lat:          listing.lat,
    lng:          listing.lng,
    operation:    listing.operation,
    price:        listing.price,
    priceHidden:  listing.priceHidden,
    communityFees: listing.communityFees,
    type:         listing.type,
    condition:    listing.condition,
    areaM2:       listing.areaM2,
    yearBuilt:    listing.yearBuilt,
    bedrooms:     listing.bedrooms,
    bathrooms:    listing.bathrooms,
    energyStatus: listing.energyStatus,
    energyLabel:  listing.energyLabel,
    energyConsumption: listing.energyConsumption,
    energyEmissions:   listing.energyEmissions,
    reference:    listing.reference,
    contactEmail: listing.contactEmail,
    contactPhone: listing.contactPhone,
    coverUrl:     listing.coverUrl,
    images:       listing.images.map((img) => ({ id: img.id, url: img.url })),
    extras:       (listing.extras as Record<string, unknown>) ?? {},
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar inmueble</h1>
        <Link
          href={`/listings/${id}`}
          className="text-sm text-blue-600 underline"
        >
          ← Volver al anuncio
        </Link>
      </div>
      <EditListingForm initial={initial} />
    </main>
  );
}
