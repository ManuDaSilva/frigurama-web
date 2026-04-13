import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata, NextPage } from "next";
import type { Prisma, PropertyType } from "@prisma/client";
import ListingCard from "@/components/ListingCard";
import StaggeredLines from "@/components/StaggeredLines";

export const metadata: Metadata = {
  title: "Inmuebles en venta y alquiler",
  description:
    "Consulta nuestra selección de pisos, áticos, chalets, estudios y locales. Propiedades en venta y alquiler con fotos, precio detallado y ubicación exacta.",
};

type SP = { [k: string]: string | string[] | undefined };

function toInt(v: string | undefined) {
  if (!v?.trim()) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const PROPERTY_TYPES = [
  { value: "Apartamento", label: "Apartamentos" },
  { value: "Piso",    label: "Pisos"    },
  { value: "Atico",   label: "Áticos"   },
  { value: "Casa",    label: "Casas/Villas" },
  { value: "Adosado", label: "Adosados" },
  { value: "Estudio", label: "Estudios" },
  { value: "Local",   label: "Locales"  },
  { value: "Garaje",  label: "Garajes"  },
  { value: "Terreno", label: "Terrenos/Naves Industriales" },
  { value: "Oficina", label: "Edificios/Oficinas" },
] as const;

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  // ── Filtros ──────────────────────────────────────────────────────────────
  const q        = (sp.q    as string | undefined)?.trim();
  const city     = (sp.city as string | undefined)?.trim();
  const VALID_TYPES = ["Apartamento","Piso","Atico","Casa","Adosado","Estudio","Local","Garaje","Terreno","Oficina"] as const;
  const rawType    = (sp.type as string | undefined)?.trim();
  const typeFilter = VALID_TYPES.includes(rawType as never) ? (rawType as PropertyType) : undefined;
  const rawOp    = (sp.op as string | undefined)?.trim();
  const opFilter = rawOp === "venta" || rawOp === "alquiler" ? rawOp : undefined;
  const min      = toInt(sp.min      as string | undefined);
  const max      = toInt(sp.max      as string | undefined);
  const minRooms = toInt(sp.bedrooms as string | undefined);
  const minBaths = toInt(sp.bathrooms as string | undefined);
  const minArea  = toInt(sp.minArea  as string | undefined);

  // ── Paginación ───────────────────────────────────────────────────────────
  const pageSize   = Math.max(1, Number(sp.pageSize ?? 12));
  const page       = Math.max(1, Number(sp.page ?? 1));

  // ── Ordenación ───────────────────────────────────────────────────────────
  const sort    = (sp.sort as string) || "createdAt";
  const dir     = (sp.dir  as string) || "desc";
  const orderBy = { [sort]: dir === "asc" ? "asc" : "desc" } as const;

  // ── WHERE dinámico ───────────────────────────────────────────────────────
  const where: Prisma.ListingWhereInput = {
    status: "activo",
    published: true,
    ...(opFilter   ? { operation: opFilter } : {}),
    ...(typeFilter ? { type: typeFilter }    : {}),
    ...(q
      ? { OR: [
            { title:       { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ] }
      : {}),
    ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
    ...(min != null || max != null
      ? { price: { gte: min ?? undefined, lte: max ?? undefined } }
      : {}),
    ...(minRooms != null ? { bedrooms: { gte: minRooms } } : {}),
    ...(minBaths != null ? { bathrooms: { gte: minBaths } } : {}),
    ...(minArea  != null ? { areaM2:   { gte: minArea  } } : {}),
  };

  // ── Totales ──────────────────────────────────────────────────────────────
  const total      = await prisma.listing.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset      = (currentPage - 1) * pageSize;

  // ── Datos ────────────────────────────────────────────────────────────────
  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    skip: offset,
    take: pageSize,
    select: {
      id:        true,
      title:     true,
      price:     true,
      city:      true,
      areaM2:    true,
      bedrooms:  true,
      bathrooms: true,
      coverUrl:  true,
      type:      true,
      operation: true,
    },
  });

  // ── URL helpers ──────────────────────────────────────────────────────────
  const baseParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v != null && v !== "" && k !== "page") baseParams.set(k, String(v));
  }
  const urlForPage = (p: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(p));
    return `/listings?${params.toString()}`;
  };

  // Type-pill URLs: preserve all active filters except type and page
  const baseNoType = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v != null && v !== "" && k !== "type" && k !== "page") {
      baseNoType.set(k, String(v));
    }
  }
  const urlForType = (type?: string) => {
    const params = new URLSearchParams(baseNoType);
    if (type) params.set("type", type);
    const str = params.toString();
    return str ? `/listings?${str}` : "/listings";
  };

  // Op-pill URLs: preserve all active filters except op and page
  const baseNoOp = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v != null && v !== "" && k !== "op" && k !== "page") {
      baseNoOp.set(k, String(v));
    }
  }
  const urlForOp = (op?: string) => {
    const params = new URLSearchParams(baseNoOp);
    if (op) params.set("op", op);
    const str = params.toString();
    return str ? `/listings?${str}` : "/listings";
  };

  const hasFilters = !!(
    q || city || typeFilter || opFilter ||
    min != null || max != null ||
    minRooms != null || minBaths != null || minArea != null
  );

  // ── Pill classes ─────────────────────────────────────────────────────────
  const pillActive   = "bg-gray-900 text-white border-gray-900";
  const pillInactive = "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900";
  const pillBase     = "px-4 py-1.5 rounded-full text-[11px] tracking-wide border transition-colors whitespace-nowrap";

  return (
    <div className="bg-[#e7ecec]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 lg:pl-8 lg:pr-12 pt-16 pb-14">
        <p className="text-[10px] tracking-[0.38em] uppercase text-gray-400 mb-5">(01)</p>
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] items-end gap-8 lg:gap-16">
          <h1 className="text-7xl lg:text-8xl xl:text-[9rem] font-light tracking-tight text-gray-900 leading-none">
            {typeFilter
              ? PROPERTY_TYPES.find((t) => t.value === typeFilter)?.label ?? "Todos"
              : "Todos"}
          </h1>
          <div className="lg:pb-2 space-y-4 lg:border-l lg:border-gray-300 lg:pl-8">
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Selección de propiedades residenciales en las mejores ubicaciones de la ciudad.
            </p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400">
              {total === 1
                ? "1 propiedad disponible"
                : `${total} propiedades disponibles`}
            </p>
            <StaggeredLines />
          </div>
        </div>
      </section>

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <section className="w-full px-6 lg:pl-8 lg:pr-12">
        <div className="border-t border-gray-300 pt-5">

          {/* Operación — pills de navegación (sin JS) */}
          <div className="flex flex-wrap gap-2 pb-3">
            <Link href={urlForOp()} className={`${pillBase} ${!opFilter ? pillActive : pillInactive}`}>
              Todas
            </Link>
            <Link href={urlForOp("venta")} className={`${pillBase} ${opFilter === "venta" ? pillActive : pillInactive}`}>
              Venta
            </Link>
            <Link href={urlForOp("alquiler")} className={`${pillBase} ${opFilter === "alquiler" ? pillActive : pillInactive}`}>
              Alquiler
            </Link>
          </div>

          {/* Tipo — pills de navegación (sin JS) */}
          <div className="flex flex-wrap gap-2 pb-5">
            <Link href={urlForType()} className={`${pillBase} ${!typeFilter ? pillActive : pillInactive}`}>
              Todos
            </Link>
            {PROPERTY_TYPES.map(({ value, label }) => (
              <Link
                key={value}
                href={urlForType(value)}
                className={`${pillBase} ${typeFilter === value ? pillActive : pillInactive}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Filtros secundarios */}
          <form method="GET" action="/listings" className="pb-10 flex flex-col gap-3">
            {opFilter   && <input type="hidden" name="op"   value={opFilter}   />}
            {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
            {(["asc","desc"].includes(dir) && sort !== "createdAt") && (
              <>
                <input type="hidden" name="sort" value={sort} />
                <input type="hidden" name="dir"  value={dir} />
              </>
            )}

            {/* Fila 1 — filtros primarios */}
            <div className="flex flex-wrap gap-2 items-center">
              <input
                name="q" placeholder="Buscar…" defaultValue={q ?? ""}
                className="border border-gray-300 rounded-full px-4 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-900 w-40"
              />
              <input
                name="city" placeholder="Ciudad" defaultValue={city ?? ""}
                className="border border-gray-300 rounded-full px-4 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-900 w-32"
              />
              <input
                name="min" type="number" min={0} placeholder="€ mínimo" defaultValue={min ?? ""}
                className="border border-gray-300 rounded-full px-4 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-900 w-28"
              />
              <input
                name="max" type="number" min={0} placeholder="€ máximo" defaultValue={max ?? ""}
                className="border border-gray-300 rounded-full px-4 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-900 w-28"
              />
              <button
                type="submit"
                className="px-5 py-1.5 rounded-full text-[11px] tracking-wide bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                Filtrar
              </button>
              {hasFilters && (
                <Link
                  href="/listings"
                  className="px-5 py-1.5 rounded-full text-[11px] tracking-wide border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-colors"
                >
                  Limpiar
                </Link>
              )}
            </div>

            {/* Fila 2 — filtros secundarios */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[13px] tracking-[0.18em] uppercase text-gray-500 mr-1">Refinar:</span>
              <input
                name="bedrooms" type="number" min={0} placeholder="Hab. mín" defaultValue={minRooms ?? ""}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 placeholder-gray-300 bg-white focus:outline-none focus:border-gray-400 w-24"
              />
              <input
                name="bathrooms" type="number" min={0} placeholder="Baños mín" defaultValue={minBaths ?? ""}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 placeholder-gray-300 bg-white focus:outline-none focus:border-gray-400 w-24"
              />
              <input
                name="minArea" type="number" min={0} placeholder="m² mín" defaultValue={minArea ?? ""}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 placeholder-gray-300 bg-white focus:outline-none focus:border-gray-400 w-24"
              />
            </div>
          </form>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 pb-40">
        {listings.length === 0 ? (
          <p className="text-sm text-gray-400 py-24 text-center tracking-wide">
            No hay propiedades que coincidan con el filtro.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {listings.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </ul>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-4" aria-label="Paginación">
            <Link
              href={urlForPage(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={`px-6 py-2 rounded-full text-[11px] tracking-wide border transition-colors ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 pointer-events-none"
                  : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              ← Anterior
            </Link>
            <span className="text-[11px] text-gray-400 tracking-wide">
              {currentPage} / {totalPages}
            </span>
            <Link
              href={urlForPage(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={`px-6 py-2 rounded-full text-[11px] tracking-wide border transition-colors ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-300 pointer-events-none"
                  : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              Siguiente →
            </Link>
          </nav>
        )}

        <p className="text-center text-[11px] text-gray-400 tracking-wide mt-5">
          {total === 1 ? "1 propiedad" : `${total} propiedades`}
          {currentPage > 1 && ` · página ${currentPage} de ${totalPages}`}
        </p>
      </section>

    </div>
  );
}
