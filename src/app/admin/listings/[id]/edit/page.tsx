import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditListingForm, {
  type InitialData,
} from "@/app/(public)/listings/[id]/edit/EditListingForm";

export const dynamic = "force-dynamic";

export default async function AdminEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: "asc" } } },
  });

  if (!listing) notFound();

  const initial: InitialData = {
    id:                listing.id,
    status:            listing.status,
    published:         listing.published,
    title:             listing.title,
    description:       listing.description,
    address:           listing.address,
    city:              listing.city,
    province:          listing.province,
    zip:               listing.zip,
    lat:               listing.lat,
    lng:               listing.lng,
    operation:         listing.operation,
    price:             listing.price,
    priceHidden:       listing.priceHidden,
    communityFees:     listing.communityFees,
    type:              listing.type,
    condition:         listing.condition,
    areaM2:            listing.areaM2,
    yearBuilt:         listing.yearBuilt,
    bedrooms:          listing.bedrooms,
    bathrooms:         listing.bathrooms,
    energyStatus:           listing.energyStatus,
    energyConsumption:      listing.energyConsumption,
    energyConsumptionLabel: listing.energyConsumptionLabel,
    energyEmissions:        listing.energyEmissions,
    energyEmissionsLabel:   listing.energyEmissionsLabel,
    reference:         listing.reference,
    contactEmail:      listing.contactEmail,
    contactPhone:      listing.contactPhone,
    coverUrl:          listing.coverUrl,
    images:            listing.images.map((img) => ({ id: img.id, url: img.url })),
    extras:            (listing.extras as Record<string, unknown>) ?? {},
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {listing.title ?? <span className="text-gray-400 italic font-normal">Sin título</span>}
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/listings"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← Inmuebles
          </Link>
          {listing.status === "activo" && listing.published && (
            <a
              href={`/listings/${listing.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
            >
              Ver pública ↗
            </a>
          )}
        </div>
      </div>
      <EditListingForm
        initial={initial}
        mode="edit"
        redirectTo="/admin/listings"
      />
    </div>
  );
}
