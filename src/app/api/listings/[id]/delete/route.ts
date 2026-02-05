import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { id } = await params;

  await prisma.listing.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
}
