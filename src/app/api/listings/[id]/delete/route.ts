import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.listing.delete({
    where: {
      id: params.id,
    },
  });

  return new Response(null, { status: 204 });
}
