import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export const metadata = { title: "Admin — Frigurama" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top nav bar ───────────────────────────────────── */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

          {/* Brand */}
          <span className="font-semibold text-sm tracking-wide">
            Frigurama <span className="text-gray-400 font-normal">Admin</span>
          </span>

          {/* Nav links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/listings"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Inmuebles
            </Link>
            <Link
              href="/admin/content"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Contenido
            </Link>
            {session?.role === "superadmin" && (
              <Link
                href="/admin/users"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Usuarios
              </Link>
            )}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-4 text-sm ml-auto">
            <span className="text-gray-400 hidden sm:block">
              {session?.username}
            </span>
            <LogoutButton />
          </div>

        </div>
      </header>

      {/* ── Page content ──────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>

    </div>
  );
}
