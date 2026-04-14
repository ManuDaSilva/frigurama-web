import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: "asc" } } },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const project = await prisma.project.update({
    where: { id },
    data: {
      title:       body.title       ?? undefined,
      description: body.description ?? null,
      coverUrl:    body.coverUrl    ?? null,
      location:    body.location    ?? null,
      year:        body.year        ? Number(body.year) : null,
      status:      body.status      ?? undefined,
      published:   body.published   ?? undefined,
    },
  });
  return NextResponse.json(project);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
