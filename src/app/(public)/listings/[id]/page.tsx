// src/app/listings/[id]/page.tsx
import { notFound } from "next/navigation";
import ListingHero from "@/components/ListingHero";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ---------- METADATA (detalle) ---------- */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  const listing = await prisma.listing.findFirst({
    where: { id, status: "activo", published: true },
    select: {
      title: true,
      description: true,
      coverUrl: true,
      price: true,
      priceHidden: true,
      city: true,
      address: true as any,
      operation: true,
      type: true,
      areaM2: true,
      bedrooms: true,
      energyConsumption: true,
      energyConsumptionLabel: true,
      energyEmissions: true,
      energyEmissionsLabel: true,
    },
  });

  if (!listing) notFound();

  const location = (listing as any).address ?? listing.city ?? "";
  const title = `${listing.title ?? "Inmueble"}${location ? ` – ${location}` : ""}`;

  const priceStr =
    !listing.priceHidden && typeof listing.price === "number"
      ? new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(listing.price)
      : null;

  const opLabel =
    listing.operation === "alquiler" ? "Alquiler" :
    listing.operation === "venta"    ? "Venta"    : null;

  const typeLabel =
    (listing as any).type === "Atico" ? "Ático" : (listing as any).type;

  // Auto-description with useful specs when there's no manual description
  const autoDescription = [
    opLabel,
    typeLabel,
    listing.areaM2 ? `${listing.areaM2} m²` : null,
    listing.bedrooms ? `${listing.bedrooms} hab.` : null,
    location ? `en ${location}` : null,
    priceStr ? `· ${priceStr}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const rawDescription = listing.description
    ? listing.description.length > 155
      ? `${listing.description.slice(0, 152)}…`
      : listing.description
    : autoDescription;

  const description = rawDescription || `Inmueble en ${location || "España"}`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: listing.coverUrl
        ? [{ url: listing.coverUrl, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

/* ---------- Componente etiqueta energética ---------- */

const ENERGY_COLORS = [
  "#00b050", // A
  "#92d050", // B
  "#c8d40c", // C
  "#ffd700", // D
  "#ffa500", // E
  "#ed7d31", // F
  "#e00000", // G
] as const;

const GRADES = ["A", "B", "C", "D", "E", "F", "G"] as const;

function EnergyScale({
  title,
  unit,
  value,
  activeGrade,
}: {
  title: string;
  unit: string;
  value: number | null;
  activeGrade: string;
}) {
  const BAR_MIN     = 46;
  const BAR_STEP    = 13;
  const ARROW_TIP   = 10;
  const ROW_H       = 26;
  const ROW_GAP     = 2;
  const ROW_STRIDE  = ROW_H + ROW_GAP;
  const CALLOUT_W   = 78;
  const CALLOUT_GAP = 3;
  const SVG_W       = 236;
  const SVG_H       = GRADES.length * ROW_STRIDE - ROW_GAP;

  const active = activeGrade.trim().toUpperCase();

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">
        {title}
      </p>
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="max-w-full"
        aria-label={title}
        role="img"
      >
        {GRADES.map((g, i) => {
          const barW     = BAR_MIN + i * BAR_STEP;
          const tipX     = barW + ARROW_TIP;
          const yTop     = i * ROW_STRIDE;
          const yMid     = yTop + ROW_H / 2;
          const yBot     = yTop + ROW_H;
          const isActive = g === active;
          const pts      = `0,${yTop} ${barW},${yTop} ${tipX},${yMid} ${barW},${yBot} 0,${yBot}`;
          const callX    = tipX + CALLOUT_GAP;

          return (
            <g key={g}>
              <polygon points={pts} fill={ENERGY_COLORS[i]} />
              <text x={9} y={yMid + 4} fontSize={11} fontWeight="700" fill="#fff">
                {g}
              </text>
              {isActive && (
                <>
                  <rect
                    x={callX}
                    y={yTop + 1}
                    width={CALLOUT_W}
                    height={ROW_H - 2}
                    rx={2}
                    fill="#1a1a1a"
                  />
                  <text
                    x={callX + CALLOUT_W / 2}
                    y={yMid + 4}
                    fontSize={11}
                    fontWeight="700"
                    fill="#fff"
                    textAnchor="middle"
                  >
                    {value !== null ? value : "—"}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-[11px] text-gray-400 leading-tight">{unit}</p>
    </div>
  );
}

function EnergyBadge({
  consumptionLabel,
  consumption,
  emissionsLabel,
  emissions,
}: {
  consumptionLabel?: string | null;
  consumption?: number | string | null;
  emissionsLabel?: string | null;
  emissions?: number | string | null;
}) {
  const consGrade = (consumptionLabel ?? "").toString().trim().toUpperCase();
  const emisGrade = (emissionsLabel ?? "").toString().trim().toUpperCase();
  const cons =
    consumption === null || consumption === undefined || consumption === ""
      ? null : Number(consumption);
  const emis =
    emissions === null || emissions === undefined || emissions === ""
      ? null : Number(emissions);

  return (
    <section className="space-y-4 border rounded-lg p-5">
      <h2 className="text-2xl font-semibold">Calificación energética</h2>
      <div className="flex flex-col sm:flex-row gap-6">
        {consGrade && (
          <EnergyScale
            title="Consumo de energía primaria"
            unit="kWh/m²·año"
            value={cons}
            activeGrade={consGrade}
          />
        )}
        {emisGrade && (
          <EnergyScale
            title="Emisiones de CO₂"
            unit="kg CO₂/m²·año"
            value={emis}
            activeGrade={emisGrade}
          />
        )}
      </div>
    </section>
  );
}

/* ---------- PAGE (detalle) ---------- */
export default async function ListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findFirst({
    where: { id, status: "activo", published: true },
    include: { images: true },
  });

  if (!listing) notFound();

  const ex       = (listing as any).extras ?? {};
  const location = (listing as any).address ?? listing.city ?? "—";

  const chips: string[] = [
    ...(ex.calefRefri    ?? []),
    ...(ex.interiores    ?? []),
    ...(ex.equipamiento  ?? []),
    ...(ex.electro       ?? []),
    ...(ex.exteriores    ?? []),
    ...(ex.comunidad     ?? []),
    ...(ex.seguridad     ?? []),
  ];
  if (ex.hotWaterType) chips.push(`Agua caliente: ${ex.hotWaterType}`);
  if (ex.heatingType)  chips.push(`Calefacción: ${ex.heatingType}`);
  if (typeof ex.terrazaM2 === "number") chips.push(`Terraza ${ex.terrazaM2} m²`);

  return (
    <main className="min-h-screen bg-[#e7ecec]">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <ListingHero
        images={listing.images.map((img) => ({ id: img.id, url: img.url }))}
        coverUrl={listing.coverUrl}
        title={listing.title}
        operation={(listing as any).operation}
        price={listing.price}
        priceHidden={listing.priceHidden}
        communityFees={listing.communityFees}
        location={location}
        type={(listing as any).type}
        areaM2={listing.areaM2}
        bedrooms={listing.bedrooms}
        bathrooms={listing.bathrooms}
        contactEmail={listing.contactEmail}
        contactPhone={listing.contactPhone}
      />

      {/* ── DIVISOR ────────────────────────────────────────────── */}
      <div className="border-t border-black/8" />

      {/* ── CONTENIDO ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 space-y-14">

        {/* Descripción */}
        {listing.description && (
          <section className="space-y-4 max-w-3xl">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/55">
              Descripción
            </h2>
            <p className="text-[16px] leading-[1.75] text-black/72 whitespace-pre-wrap">
              {listing.description}
            </p>
          </section>
        )}

        {/* Características */}
        {chips.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/55">
              Características
            </h2>
            <div className="flex flex-wrap gap-2">
              {chips.map((c: string, i: number) => (
                <span
                  key={`${c}-${i}`}
                  className="text-[11px] tracking-wide px-3 py-1.5 rounded-full border border-black/15 text-black/60"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certificado energético */}
        {listing.energyStatus === "tramite" && (
          <section className="space-y-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/55">
              Certificado energético
            </h2>
            <p className="text-sm text-black/55">En trámite</p>
          </section>
        )}
        {listing.energyStatus === "exento" && (
          <section className="space-y-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/55">
              Certificado energético
            </h2>
            <p className="text-sm text-black/55">Exento</p>
          </section>
        )}
        {(listing.energyStatus === "tiene" || listing.energyStatus === null) &&
          (listing.energyConsumptionLabel || listing.energyEmissionsLabel) && (
            <EnergyBadge
              consumptionLabel={listing.energyConsumptionLabel}
              consumption={listing.energyConsumption}
              emissionsLabel={listing.energyEmissionsLabel}
              emissions={listing.energyEmissions}
            />
          )}

        {/* Mapa */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/55">
            Ubicación
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-black/8">
            <iframe
              width="100%"
              height="420"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={
                listing.lat && listing.lng
                  ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${listing.lat},${listing.lng}`
                  : `https://www.google.com/maps?q=${encodeURIComponent(
                      listing.address || listing.city || ""
                    )}&output=embed`
              }
            />
          </div>
          <p className="text-[11px] text-black/30">
            Ubicación seleccionada por el anunciante.
          </p>
        </section>

        {/* Fecha */}
        <p className="text-[11px] text-black/30 tracking-wide">
          Publicado:{" "}
          {new Date(listing.createdAt).toLocaleDateString("es-ES")}
        </p>

      </div>
    </main>
  );
}