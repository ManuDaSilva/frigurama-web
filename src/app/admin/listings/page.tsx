import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { ListingStatus } from "@prisma/client";
import AdminListingActions from "./AdminListingActions";

export const dynamic = "force-dynamic";

// ── Status badge config ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ListingStatus,
  { label: string; color: string }
> = {
  activo:    { label: "Activo",    color: "bg-green-100  text-green-800"  },
  oculto:    { label: "Oculto",    color: "bg-gray-100   text-gray-600"   },
  vendido:   { label: "Vendido",   color: "bg-blue-100   text-blue-800"   },
  alquilado: { label: "Alquilado", color: "bg-purple-100 text-purple-800" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as ListingStatus[];

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const rawStatus = sp.status as string | undefined;
  const statusFilter = ALL_STATUSES.includes(rawStatus as ListingStatus)
    ? (rawStatus as ListingStatus)
    : undefined;
  const q = (sp.q as string | undefined)?.trim() || undefined;

  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { city:  { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      city: true,
      price: true,
      status: true,
      type: true,
      operation: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inmuebles</h1>
        <Link
          href="/admin/listings/new"
          className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Nuevo inmueble
        </Link>
      </div>

      {/* ── Search ── */}
      <form method="GET" action="/admin/listings" className="flex gap-2">
        {statusFilter && (
          <input type="hidden" name="status" value={statusFilter} />
        )}
        <input
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Buscar por título o ciudad…"
          className="flex-1 text-sm border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="text-sm border rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors"
        >
          Buscar
        </button>
        {q && (
          <Link
            href={statusFilter ? `/admin/listings?status=${statusFilter}` : "/admin/listings"}
            className="text-sm border rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors text-gray-500"
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* ── Status filter tabs ── */}
      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href={q ? `/admin/listings?q=${encodeURIComponent(q)}` : "/admin/listings"}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            !statusFilter
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Todos
        </Link>
        {ALL_STATUSES.map((s) => {
          const href = q
            ? `/admin/listings?status=${s}&q=${encodeURIComponent(q)}`
            : `/admin/listings?status=${s}`;
          return (
            <Link
              key={s}
              href={href}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                statusFilter === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {STATUS_CONFIG[s].label}
            </Link>
          );
        })}
      </div>

      {/* ── Result count ── */}
      <p className="text-xs text-gray-400">
        {listings.length === 1 ? "1 inmueble" : `${listings.length} inmuebles`}
        {statusFilter ? ` · ${STATUS_CONFIG[statusFilter].label}` : ""}
        {q ? ` · "${q}"` : ""}
      </p>

      {/* ── Table ── */}
      {listings.length === 0 ? (
        <p className="text-sm text-gray-500 py-12 text-center">
          No hay inmuebles{statusFilter ? ` con estado "${STATUS_CONFIG[statusFilter].label}"` : ""}
          {q ? ` que coincidan con "${q}"` : ""}.
        </p>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Inmueble</th>
                <th className="px-4 py-3 hidden sm:table-cell">Ciudad</th>
                <th className="px-4 py-3 hidden md:table-cell">Tipo / Op.</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 hidden lg:table-cell">Actualizado</th>
                <th className="px-4 py-3 text-right sr-only">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[220px] truncate">
                    {l.title ?? <span className="text-gray-400 italic">Sin título</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {l.city ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {[l.type, l.operation].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                    {l.price.toLocaleString("es-ES")} €
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[l.status].color}`}
                    >
                      {STATUS_CONFIG[l.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell whitespace-nowrap">
                    {l.updatedAt.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminListingActions
                      id={l.id}
                      status={l.status}
                      title={l.title}
                      isPublic={l.status === "activo"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
