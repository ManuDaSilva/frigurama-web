import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: { id: string };
};

export async function DELETE(_req: Request, { params }: RouteParams) {
  await prisma.listing.delete({
    where: {
      id: params.id, // ✅ string, coincide con Prisma
    },
  });

  return new Response(null, { status: 204 });
}
