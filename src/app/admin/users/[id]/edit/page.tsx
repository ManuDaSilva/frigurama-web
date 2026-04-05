import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, isSuperAdmin } from "@/lib/auth";
import UserForm from "../../UserForm";

export const dynamic = "force-dynamic";

export default async function AdminEditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!isSuperAdmin(session)) redirect("/admin");

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, name: true, email: true, role: true },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {user.username ?? <span className="text-gray-400 italic font-normal">Sin usuario</span>}
        </h1>
        <Link href="/admin/users" className="text-sm text-gray-500 hover:text-black transition-colors">
          ← Usuarios
        </Link>
      </div>
      <UserForm
        mode="edit"
        initial={user}
        currentUserId={session!.sub}
      />
    </div>
  );
}
