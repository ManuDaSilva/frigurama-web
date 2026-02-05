// src/app/listings/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import ListingCard from "@/components/ListingCard";


type SP = { [k: string]: string | string[] | undefined };

function toInt(v: string | undefined) {
  if (!v?.trim()) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  // ========= Filtros =========
  const q = (sp.q as string | undefined)?.trim();
  const city = (sp.city as string | undefined)?.trim();
  const min = toInt(sp.min as string | undefined);
  const max = toInt(sp.max as string | undefined);
  const minRooms = toInt(sp.bedrooms as string | undefined);
  const minBaths = toInt(sp.bathrooms as string | undefined);
  const minArea = toInt(sp.minArea as string | undefined);

  // ========= Paginación =========
  const pageSize = Math.max(1, Number(sp.pageSize ?? 10)); // por defecto 10
  const page = Math.max(1, Number(sp.page ?? 1));

  // ========= Ordenación =========
  const sort = (sp.sort as string) || "createdAt";
  const dir = (sp.dir as string) || "desc";
  const orderBy = { [sort]: dir === "asc" ? "asc" : "desc" } as const;

  // ========= WHERE dinámico (Prisma) =========
  const where: Prisma.ListingWhereInput = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
    ...(min != null || max != null
      ? { price: { gte: min ?? undefined, lte: max ?? undefined } }
      : {}),
    ...(minRooms != null ? { bedrooms: { gte: minRooms } } : {}),
    ...(minBaths != null ? { bathrooms: { gte: minBaths } } : {}),
    ...(minArea != null ? { areaM2: { gte: minArea } } : {}),
  };

  // ========= Total + páginas seguras =========
  const total = await prisma.listing.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;

  // ========= Datos =========
  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    skip: offset,
    take: pageSize,
    select: {
      id: true,
      title: true,
      price: true,
      city: true,
      areaM2: true,
      bedrooms: true,
      bathrooms: true,
      createdAt: true,
      coverUrl: true,
    },
  });

  // ========= Helper para URLs con filtros preservados =========
  const baseParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v != null && v !== "" && k !== "page") baseParams.set(k, String(v));
  }
  const urlForPage = (p: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(p));
    return `/listings?${params.toString()}`;
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Inmuebles en venta</h1>
        <Link href="/listings/new" className="bg-black text-white px-3 py-2 rounded">
          Nuevo
        </Link>
      </div>

      {/* ====== Filtros (GET) ====== */}
      <form className="grid md:grid-cols-8 gap-3 mb-6" method="GET">
        <input
          name="q"
          placeholder="Búsqueda"
          defaultValue={q ?? ""}
          className="border rounded px-3 py-2 md:col-span-2"
        />
        <input
          name="city"
          placeholder="Ciudad"
          defaultValue={city ?? ""}
          className="border rounded px-3 py-2"
        />
        <input
          name="min"
          type="number"
          min={0}
          placeholder="€ mín"
          defaultValue={min ?? ""}
          className="border rounded px-3 py-2"
        />
        <input
          name="max"
          type="number"
          min={0}
          placeholder="€ máx"
          defaultValue={max ?? ""}
          className="border rounded px-3 py-2"
        />
        <input
          name="bedrooms"
          type="number"
          min={0}
          placeholder="Hab. mín"
          defaultValue={minRooms ?? ""}
          className="border rounded px-3 py-2"
        />
        <input
          name="bathrooms"
          type="number"
          min={0}
          placeholder="Baños mín"
          defaultValue={minBaths ?? ""}
          className="border rounded px-3 py-2"
        />
        <input
          name="minArea"
          type="number"
          min={0}
          placeholder="m² mín"
          defaultValue={minArea ?? ""}
          className="border rounded px-3 py-2"
        />

        {/* Ordenación y tamaño */}
        <select name="sort" defaultValue={sort} className="border rounded px-3 py-2">
          <option value="createdAt">Fecha</option>
          <option value="price">Precio</option>
        </select>
        <select name="dir" defaultValue={dir} className="border rounded px-3 py-2">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <select
          name="pageSize"
          defaultValue={String(pageSize)}
          className="border rounded px-3 py-2"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>

        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Filtrar
          </button>
          <Link href="/listings" className="px-4 py-2 rounded border">
            Limpiar
          </Link>
        </div>
      </form>

      {/* ====== Lista ====== */}
      {listings.length === 0 ? (
        <p className="text-gray-600">No hay inmuebles que coincidan con el filtro.</p>
      ) : (
        <ul className="space-y-6">
          {listings.map((l) => (
            <ListingCard key={l.id} l={l as any} />
          ))}
        </ul>
      )}

      {/* ====== Paginador ====== */}
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center gap-2" aria-label="Paginación">
          <Link
            href={urlForPage(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={`px-3 py-2 rounded border ${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            Anterior
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={urlForPage(n)}
              aria-current={n === currentPage ? "page" : undefined}
              className={`px-3 py-2 rounded border ${
                n === currentPage
                  ? "bg-black text-white border-black"
                  : "hover:bg-gray-100"
              }`}
            >
              {n}
            </Link>
          ))}

          <Link
            href={urlForPage(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded border ${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            Siguiente
          </Link>
        </nav>
      )}

      {/* ====== Resumen ====== */}
      <div className="flex items-center justify-between mt-8">
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages} — {total} resultados
        </span>
      </div>
    </main>
  );
}
