import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  const row = await prisma.siteContent.findUnique({ where: { section } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row.content);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { section } = await params;
  const content = await req.json();

  const row = await prisma.siteContent.upsert({
    where: { section },
    update: { content },
    create: { section, content },
  });

  return NextResponse.json(row.content);
}
