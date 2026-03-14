// src/app/listings/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ListingGallery from "@/components/ListingGallery";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ---------- METADATA (detalle) ---------- */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  const listing = await prisma.listing.findFirst({
    where: { id, status: "activo" },
    select: {
      title: true,
      description: true,
      coverUrl: true,
      price: true,
      city: true,
      address: true as any,
      operation: true,
      energyLabel: true,
      energyConsumption: true,
      energyEmissions: true,
    },
  });

  if (!listing) notFound();

  const location = (listing as any).address ?? listing.city ?? "";
  const title = `${listing.title} ${location ? `– ${location}` : ""}`.trim();

  const priceStr =
    typeof listing.price === "number"
      ? new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(listing.price)
      : "";

  const opLabel =
    listing.operation === "alquiler" ? "Alquiler" :
    listing.operation === "venta"    ? "Venta"    : null;

  const description =
    listing.description ??
    `Inmueble en ${location || "España"}${
      priceStr ? ` por ${priceStr}` : ""
    }${opLabel ? ` (${opLabel})` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: listing.coverUrl
        ? [{ url: listing.coverUrl, width: 1200, height: 630 }]
        : [],
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
  label,
  consumption,
  emissions,
}: {
  label?: string | null;
  consumption?: number | string | null;
  emissions?: number | string | null;
}) {
  const activeGrade = (label ?? "").toString().trim().toUpperCase();
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
        <EnergyScale
          title="Consumo de energía primaria"
          unit="kWh/m²·año"
          value={cons}
          activeGrade={activeGrade}
        />
        <EnergyScale
          title="Emisiones de CO₂"
          unit="kg CO₂/m²·año"
          value={emis}
          activeGrade={activeGrade}
        />
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
    where: { id, status: "activo" },
    include: { images: true },
  });

  if (!listing) notFound();

  const priceStr = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(listing.price ?? 0);

  const ex = (listing as any).extras ?? {};
  const chips: string[] = [
    ...(ex.calefRefri ?? []),
    ...(ex.interiores ?? []),
    ...(ex.equipamiento ?? []),
    ...(ex.electro ?? []),
    ...(ex.exteriores ?? []),
    ...(ex.comunidad ?? []),
    ...(ex.seguridad ?? []),
  ];
  if (ex.hotWaterType) chips.push(`Agua caliente: ${ex.hotWaterType}`);
  if (ex.heatingType) chips.push(`Calefacción: ${ex.heatingType}`);
  if (typeof ex.terrazaM2 === "number")
    chips.push(`Terraza ${ex.terrazaM2} m²`);

  const op = (listing as any).operation;
  const location = (listing as any).address ?? listing.city ?? "—";

  const basicRows: Array<[string, string | number | null | undefined]> = [
    ["Tipo de inmueble", (listing as any).type],
    ["Operación", op === "alquiler" ? "Alquiler" : "Venta"],
    ["Ciudad", location],
    ["m²", listing.areaM2],
    ["Habitaciones", listing.bedrooms],
    ["Baños", listing.bathrooms],
  ];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Volver */}
      <Link href="/listings" className="text-blue-600 underline text-sm">
        ← Volver
      </Link>

      {/* Cabecera */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-xl">
          {priceStr}
          {op === "alquiler" ? " /mes" : ""}
        </p>
      </header>

      {/* Galería */}
      <ListingGallery
        images={listing.images.map((img) => ({ id: img.id, url: img.url }))}
        coverUrl={listing.coverUrl}
        title={listing.title ?? ""}
      />


      {/* Datos básicos + contacto */}
      <section className="space-y-2">
        <div className="text-gray-700 grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
          {basicRows.map(([label, value]) => (
            <p key={label}>
              <strong>{label}:</strong> {value ?? "—"}
            </p>
          ))}
        </div>
          <div className="pt-2">
            <Link
              href={`mailto:${listing.contactEmail ?? "info@frigurama.com"}?subject=Interés en ${encodeURIComponent(
                listing.title ?? ""
              )}`}
              className="inline-block bg-black text-white px-4 py-2 rounded"
            >
              Contactar por email
            </Link>
          </div>
      </section>

      {/* Descripción */}
      {listing.description && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Descripción</h2>
          <p className="leading-relaxed whitespace-pre-wrap">
            {listing.description}
          </p>
        </section>
      )}

      {/* Características */}
      {chips.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Características</h2>
          <div className="flex flex-wrap gap-2">
            {chips.map((c: string, i: number) => (
              <span
                key={`${c}-${i}`}
                className="text-sm px-3 py-1 rounded-full border"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certificado energético */}
      {listing.energyStatus === "tramite" && (
        <section className="space-y-1">
          <h2 className="text-2xl font-semibold">Certificado energético</h2>
          <p className="text-gray-600">En trámite</p>
        </section>
      )}
      {listing.energyStatus === "exento" && (
        <section className="space-y-1">
          <h2 className="text-2xl font-semibold">Certificado energético</h2>
          <p className="text-gray-600">Exento</p>
        </section>
      )}
      {(listing.energyStatus === "tiene" || listing.energyStatus === null) &&
        listing.energyLabel && (
          <EnergyBadge
            label={listing.energyLabel}
            consumption={listing.energyConsumption}
            emissions={listing.energyEmissions}
          />
        )}

      {/* Información del precio */}
      <section className="space-y-1">
        <h2 className="text-2xl font-semibold">Información del precio</h2>
        <p>
          {op === "alquiler" ? "Precio de alquiler:" : "Precio de venta:"}{" "}
          <strong>{priceStr}</strong>
          {op === "alquiler" ? " /mes" : ""}
        </p>
      </section>

      {/* Mapa EXACTO con coordenadas reales */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Ubicación exacta</h2>

        <div className="rounded border overflow-hidden">
          <iframe
            width="100%"
            height="350"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={
              listing.lat && listing.lng
                ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${listing.lat},${listing.lng}`
                : `https://www.google.com/maps?q=${encodeURIComponent(listing.address || listing.city || "")}&output=embed`
            }
          />
        </div>

        <p className="text-xs text-gray-500">
          * Ubicación seleccionada por el anunciante.
        </p>
      </section>

      {/* Fecha publicación */}
      <p className="text-sm text-gray-500">
        Publicado:{" "}
        {new Date(listing.createdAt).toLocaleDateString("es-ES")}
      </p>
    </main>
  );
}