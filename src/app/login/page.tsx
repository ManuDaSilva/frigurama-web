import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Acceso — Rigurama" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  // Already authenticated → go straight to admin
  const session = await getSession();
  if (session) redirect("/admin");

  const { from } = await searchParams;
  const redirectTo = from && from.startsWith("/") ? from : "/admin";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Rigurama</h1>
          <p className="text-sm text-gray-600">Acceso al panel de administración</p>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
