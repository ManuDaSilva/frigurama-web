import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSession, isSuperAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { username, name, email, role, newPassword } = await req.json();

    const validRoles = ["admin", "superadmin"];

    const updateData: Record<string, unknown> = {
      ...(username ? { username: username.trim() } : {}),
      ...(name !== undefined ? { name: name?.trim() || null } : {}),
      ...(email !== undefined ? { email: email?.trim().toLowerCase() || null } : {}),
      ...(role && validRoles.includes(role) ? { role } : {}),
    };

    // Only update password if explicitly provided
    if (newPassword) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await prisma.user.update({ where: { id }, data: updateData });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      return NextResponse.json(
        { error: "El nombre de usuario o email ya está en uso." },
        { status: 409 }
      );
    }
    if (code === "P2025") {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  if (id === session!.sub) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta." },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2025") {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 });
  }
}
