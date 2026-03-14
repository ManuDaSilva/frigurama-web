import Link from "next/link";
import EditListingForm, {
  type InitialData,
} from "@/app/(public)/listings/[id]/edit/EditListingForm";

export const metadata = { title: "Nuevo inmueble — Admin Rigurama" };

const EMPTY: InitialData = {
  id:                null,
  status:            "activo",
  title:             null,
  description:       null,
  address:           null,
  city:              null,
  province:          null,
  zip:               null,
  lat:               null,
  lng:               null,
  operation:         null,
  price:             0,
  priceHidden:       null,
  communityFees:     null,
  type:              null,
  condition:         null,
  areaM2:            null,
  yearBuilt:         null,
  bedrooms:          null,
  bathrooms:         null,
  energyStatus:      null,
  energyLabel:       null,
  energyConsumption: null,
  energyEmissions:   null,
  reference:         null,
  contactEmail:      null,
  contactPhone:      null,
  coverUrl:          null,
  images:            [],
  extras:            {},
};

export default function AdminNewListingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nuevo inmueble</h1>
        <Link
          href="/admin/listings"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← Inmuebles
        </Link>
      </div>
      <EditListingForm
        initial={EMPTY}
        mode="create"
        redirectTo="/admin/listings"
      />
    </div>
  );
}
