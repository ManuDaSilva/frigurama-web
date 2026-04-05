import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSession, isSuperAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { username, password, name, email, role } = await req.json();

    if (!username?.trim() || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const validRoles = ["admin", "superadmin"];
    const assignedRole = validRoles.includes(role) ? role : "admin";

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        name:     name?.trim() || null,
        email:    email?.trim().toLowerCase() || null,
        passwordHash,
        role:     assignedRole,
      },
    });

    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      return NextResponse.json(
        { error: "El nombre de usuario o email ya está en uso." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 });
  }
}
