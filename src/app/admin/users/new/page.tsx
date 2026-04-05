import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isSuperAdmin } from "@/lib/auth";
import UserForm from "../UserForm";

export const metadata = { title: "Nuevo usuario — Admin Frigurama" };

export default async function AdminNewUserPage() {
  const session = await getSession();
  if (!isSuperAdmin(session)) redirect("/admin");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nuevo usuario</h1>
        <Link href="/admin/users" className="text-sm text-gray-500 hover:text-black transition-colors">
          ← Usuarios
        </Link>
      </div>
      <UserForm mode="create" currentUserId={session!.sub} />
    </div>
  );
}
