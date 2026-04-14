import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "url requerida." }, { status: 400 });

  const image = await prisma.projectImage.create({
    data: { url, projectId: id },
  });
  return NextResponse.json(image, { status: 201 });
}
