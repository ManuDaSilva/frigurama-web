import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { imageId } = await params;
  await prisma.projectImage.delete({ where: { id: imageId } });
  return NextResponse.json({ ok: true });
}
