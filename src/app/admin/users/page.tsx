import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, isSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  superadmin: { label: "Superadmin", color: "bg-purple-100 text-purple-800" },
  admin:      { label: "Admin",      color: "bg-gray-100   text-gray-700"   },
};

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!isSuperAdmin(session)) redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id:        true,
      username:  true,
      name:      true,
      email:     true,
      role:      true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Link
          href="/admin/users/new"
          className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Nuevo usuario
        </Link>
      </div>

      <p className="text-xs text-gray-400">
        {users.length === 1 ? "1 usuario" : `${users.length} usuarios`}
      </p>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3 hidden sm:table-cell">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 hidden md:table-cell">Creado</th>
              <th className="px-4 py-3 text-right sr-only">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => {
              const roleCfg = ROLE_LABELS[u.role] ?? { label: u.role, color: "bg-gray-100 text-gray-600" };
              const isSelf  = u.id === session!.sub;
              return (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{u.username ?? "—"}</div>
                    {u.name && <div className="text-xs text-gray-400">{u.name}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {u.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleCfg.color}`}>
                      {roleCfg.label}
                    </span>
                    {isSelf && (
                      <span className="ml-2 text-[10px] text-gray-400">(tú)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell whitespace-nowrap">
                    {u.createdAt.toLocaleDateString("es-ES", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u.id}/edit`}
                      className="text-sm text-gray-500 hover:text-black transition-colors"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
