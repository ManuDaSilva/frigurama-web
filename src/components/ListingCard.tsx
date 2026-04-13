import Image from "next/image";
import Link from "next/link";

type Listing = {
  id: string;
  title: string | null;
  price: number;
  city: string | null;
  areaM2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  coverUrl: string | null;
  type: string | null;
  operation: string | null;
};

export default function ListingCard({ l }: { l: Listing }) {
  const priceEUR =
    Math.round(l.price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";

  const typeLabel =
    l.type === "Atico" ? "Ático" : l.type;

  const opLabel =
    l.operation === "alquiler" ? "Alquiler" :
    l.operation === "venta"    ? "Venta"    : null;

  const subtitle = [l.city, typeLabel, opLabel]
    .filter(Boolean)
    .join(" · ");

  const specs = [
    l.areaM2    ? `${l.areaM2} m²`       : null,
    l.bedrooms  ? `${l.bedrooms} hab.`   : null,
    l.bathrooms ? `${l.bathrooms} baños` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="group rounded-xl overflow-hidden border border-gray-200 bg-[#e8ebe8] hover:shadow-sm transition-shadow duration-300">
      <Link href={`/listings/${l.id}`} className="block">

        {/* Image */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-[1/1] overflow-hidden">
          {l.coverUrl ? (
            <Image
              src={l.coverUrl}
              alt={l.title ?? "Inmueble"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {typeLabel && (
                <span className="text-3xl font-light tracking-[0.3em] uppercase text-gray-300">
                  {typeLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom band — single horizontal composition */}
        <div className="flex items-center gap-6 px-6 py-7">

          {/* Left — CTA */}
          <span className="shrink-0 px-4 py-2 bg-gray-900 text-white rounded-xl text-[11px] tracking-[0.2em] uppercase hover:bg-[#FF8614] transition-colors duration-200">
            Más info
          </span>

          {/* Center — title + subtitle */}
          <div className="flex-1 min-w-0 text-center">
            <p className="text-gray-900 font-normal text-base leading-snug truncate font-editorial">
              {l.title ?? "Sin título"}
            </p>
            {subtitle && (
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right — price + specs */}
          <div className="shrink-0 text-right">
            <p className="text-gray-900 font-bold text-sm leading-snug">{priceEUR}</p>
            {specs && (
              <p className="text-[10px] text-gray-400 mt-0.5">{specs}</p>
            )}
          </div>

        </div>

      </Link>
    </li>
  );
}
