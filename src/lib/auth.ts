import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ── Constants ────────────────────────────────────────────────────────────────

export const COOKIE_NAME = "admin_token";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set in environment variables.");
  return new TextEncoder().encode(secret);
}

// ── Types ────────────────────────────────────────────────────────────────────

export type SessionPayload = {
  sub:   string; // user id
  email: string;
  role:  string;
};

// ── JWT helpers ──────────────────────────────────────────────────────────────

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Session reader (server components + API routes only, not middleware) ──────

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
