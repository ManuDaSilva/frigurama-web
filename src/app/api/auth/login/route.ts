import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Use constant-time comparison to avoid timing attacks:
    // always run bcrypt.compare even if user not found.
    const DUMMY_HASH =
      "$2b$12$invalidhashpaddingtomatchbcryptlength00000000000000000000";
    const valid = await bcrypt.compare(
      password,
      user?.passwordHash ?? DUMMY_HASH
    );

    if (!user || !valid) {
      return NextResponse.json(
        { error: "Credenciales incorrectas." },
        { status: 401 }
      );
    }

    const token = await signToken({
      sub:   user.id,
      email: user.email,
      role:  user.role,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   COOKIE_MAX_AGE,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Error del servidor." },
      { status: 500 }
    );
  }
}
