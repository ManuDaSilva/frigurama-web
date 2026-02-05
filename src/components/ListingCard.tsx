// src/components/ListingCard.tsx
import Image from "next/image";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  price: number;
  city: string | null;
  areaM2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  createdAt: string | Date;
  coverUrl: string | null;
};

export default function ListingCard({ l }: { l: Listing }) {
  const priceEUR = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(l.price);

  const published = new Date(l.createdAt).toLocaleDateString();

  return (
    <li className="rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden">
      <Link href={`/listings/${l.id}`} className="grid gap-0 md:grid-cols-[420px,1fr]">
        {/* IMAGEN protagonista (ratio aprox. 4:3) */}
        <div className="relative w-full h-[280px] overflow-hidden rounded-t-lg">
          {l.coverUrl ? (
            <Image
              src={l.coverUrl || "/sin-foto.png"}
              alt={l.title}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover object-center"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              Sin foto
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="p-5 md:p-6 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight">
              {l.title}
            </h2>
            <div className="text-lg md:text-2xl font-bold text-emerald-600">
              {priceEUR}
            </div>
          </div>

          <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm text-gray-700">
            <div className="rounded-md border px-3 py-2 bg-white">
              <div className="text-gray-500 text-xs">Ciudad</div>
              <div className="font-medium">{l.city ?? "—"}</div>
            </div>
            <div className="rounded-md border px-3 py-2 bg-white">
              <div className="text-gray-500 text-xs">m²</div>
              <div className="font-medium">{l.areaM2 ?? "—"}</div>
            </div>
            <div className="rounded-md border px-3 py-2 bg-white">
              <div className="text-gray-500 text-xs">Habitaciones</div>
              <div className="font-medium">{l.bedrooms ?? "—"}</div>
            </div>
            <div className="rounded-md border px-3 py-2 bg-white">
              <div className="text-gray-500 text-xs">Baños</div>
              <div className="font-medium">{l.bathrooms ?? "—"}</div>
            </div>
          </div>

          <div className="mt-auto pt-2 text-xs text-gray-500">
            Publicado: {published}
          </div>
        </div>
      </Link>
    </li>
  );
}
