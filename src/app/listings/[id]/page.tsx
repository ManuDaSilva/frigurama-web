// src/app/listings/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ---------- METADATA (detalle) ---------- */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      coverUrl: true,
      price: true,
      city: true,
      address: true as any, // si no tienes address, puedes quitar esta línea
      operation: true,
      energyLabel: true,
      energyConsumption: true,
      energyEmissions: true,
    },
  });

  if (!listing) return { title: "Inmueble no encontrado" };

  const location = (listing as any).address ?? listing.city ?? "";
  const title = `${listing.title} ${location ? `– ${location}` : ""}`.trim();

  const priceStr =
    typeof listing.price === "number"
      ? new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(listing.price)
      : "";

  const description =
    listing.description ??
    `Inmueble en ${location || "España"}${
      priceStr ? ` por ${priceStr}` : ""
    }${listing.operation ? ` (${listing.operation})` : ""}`;

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
function EnergyBadge({
  label,
  consumption,
  emissions,
}: {
  label?: string | null;
  consumption?: number | string | null;
  emissions?: number | string | null;
}) {
  const grades = ["A", "B", "C", "D", "E", "F", "G"] as const;
  const active = (label ?? "").toString().trim().toUpperCase();
  const cons =
    consumption === null || consumption === undefined || consumption === ""
      ? null
      : Number(consumption);
  const emis =
    emissions === null || emissions === undefined || emissions === ""
      ? null
      : Number(emissions);

  const colors = [
    "#00b050",
    "#92d050",
    "#ffd965",
    "#ffc000",
    "#ed7d31",
    "#c55a11",
    "#ff0000",
  ];

  return (
    <section className="space-y-3 border rounded p-4">
      <h2 className="text-2xl font-semibold">
        Ver etiqueta calificación energética
      </h2>

      <div className="flex gap-6 flex-col sm:flex-row items-start">
        {/* Semáforo */}
        <svg
          width="280"
          height="160"
          viewBox="0 0 280 160"
          className="shrink-0 border rounded"
        >
          {grades.map((g, i) => {
            const y = 10 + i * 22;
            const isActive = g === active;
            return (
              <g key={g}>
                <rect x="10" y={y} width="140" height="18" rx="3" fill={colors[i]} />
                <text
                  x="18"
                  y={y + 13}
                  fontSize="12"
                  fill="#fff"
                  fontWeight="700"
                >
                  {g}
                </text>
                {isActive && (
                  <g>
                    <rect
                      x="160"
                      y={y - 2}
                      width="105"
                      height="22"
                      rx="3"
                      fill="#000"
                      opacity="0.85"
                    />
                    <text
                      x="170"
                      y={y + 13}
                      fontSize="12"
                      fill="#fff"
                      fontWeight="700"
                    >
                      {cons ?? "—"}
                      {cons !== null && emis !== null ? "  |  " : "  "}
                      {emis ?? "—"}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Valores numéricos */}
        <div className="text-sm grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Consumo de energía</p>
            <p className="text-lg font-semibold">
              {cons ?? "—"}{" "}
              <span className="text-gray-500 text-sm">kWh/m²·año</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500">Emisiones</p>
            <p className="text-lg font-semibold">
              {emis ?? "—"}{" "}
              <span className="text-gray-500 text-sm">kg CO₂/m²·año</span>
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Calificación</p>
            <p className="text-lg font-semibold">{active || "—"}</p>
          </div>
        </div>
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

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!listing) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <p className="mb-4">Inmueble no encontrado.</p>
        <Link href="/listings" className="text-blue-600 underline">
          ← Volver al listado
        </Link>
      </main>
    );
  }

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
      <div>
        <Link href="/listings" className="text-blue-600 underline">
          ← Volver
        </Link>
      </div>

      {/* Cabecera */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-xl">
          {priceStr}
          {op === "alquiler" ? " /mes" : ""}
        </p>
      </header>

      {/* Galería */}
      {listing.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {listing.images.slice(0, 3).map((img) => (
            <div
              key={img.id}
              className="relative w-full h-40 md:h-56 rounded overflow-hidden"
            >
              <Image
                src={img.url}
                alt={listing.title ?? "Foto del inmueble"}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}


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
              href={`mailto:info@tudominio.com?subject=Interés en ${encodeURIComponent(
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
      <EnergyBadge
        label={listing.energyLabel}
        consumption={listing.energyConsumption}
        emissions={listing.energyEmissions}
      />

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