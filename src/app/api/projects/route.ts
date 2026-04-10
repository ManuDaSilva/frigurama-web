import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      title:       body.title       ?? "Sin título",
      description: body.description ?? null,
      coverUrl:    body.coverUrl    ?? null,
      location:    body.location    ?? null,
      year:        body.year        ? Number(body.year) : null,
      status:      body.status      ?? "en_proceso",
      published:   body.published   ?? true,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
