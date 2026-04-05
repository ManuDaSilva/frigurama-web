import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { ListingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// ── Status display config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ListingStatus,
  { label: string; color: string; bg: string }
> = {
  activo:    { label: "Activos",    color: "text-green-700",  bg: "bg-green-50  border-green-200"  },
  oculto:    { label: "Ocultos",    color: "text-gray-600",   bg: "bg-gray-50   border-gray-200"   },
  vendido:   { label: "Vendidos",   color: "text-blue-700",   bg: "bg-blue-50   border-blue-200"   },
  alquilado: { label: "Alquilados", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
};

// ── Page ────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  // Single query: counts grouped by status
  const grouped = await prisma.listing.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  // Build a full map with zeros for any status not present in DB yet
  const counts = Object.fromEntries(
    (Object.keys(STATUS_CONFIG) as ListingStatus[]).map((s) => [s, 0])
  ) as Record<ListingStatus, number>;

  for (const row of grouped) {
    counts[row.status] = row._count.id;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/listings/new"
          className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Nuevo inmueble
        </Link>
      </div>

      {/* ── Status cards ── */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Inmuebles por estado
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(STATUS_CONFIG) as [ListingStatus, typeof STATUS_CONFIG[ListingStatus]][]).map(
            ([status, cfg]) => (
              <Link
                key={status}
                href={`/admin/listings?status=${status}`}
                className={`rounded-xl border p-5 space-y-1 hover:shadow-sm transition-shadow ${cfg.bg}`}
              >
                <div className={`text-3xl font-bold ${cfg.color}`}>
                  {counts[status]}
                </div>
                <div className="text-sm text-gray-600">{cfg.label}</div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* ── Total + quick actions ── */}
      <section className="flex flex-col sm:flex-row gap-4">
        <div className="rounded-xl border bg-white p-5 flex-1">
          <div className="text-3xl font-bold">{total}</div>
          <div className="text-sm text-gray-500 mt-1">Total de inmuebles</div>
        </div>

        <div className="rounded-xl border bg-white p-5 flex-1 flex flex-col gap-3 justify-center">
          <p className="text-sm font-medium text-gray-700">Acciones rápidas</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/listings"
              className="text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Gestionar inmuebles
            </Link>
            <Link
              href="/admin/listings/new"
              className="text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Publicar inmueble
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
