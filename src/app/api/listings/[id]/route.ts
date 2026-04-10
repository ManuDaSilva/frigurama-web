import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type {
  Operation,
  PropertyType,
  EnergyStatus,
  ListingStatus,
} from "@prisma/client";

type Context = { params: Promise<{ id: string }> };

const toNum = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const toStr = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
};

function mapOperation(x?: string): Operation | null {
  if (x === "venta" || x === "alquiler" || x === "compartir") return x;
  return null;
}

function mapPropertyType(x?: string): PropertyType | null {
  const valid = [
    "Piso","Atico","Casa","Adosado","Estudio","Local","Garaje","Terreno","Oficina",
  ] as const;
  return valid.includes(x as never) ? (x as PropertyType) : null;
}

function mapEnergyStatus(x?: string): EnergyStatus | null {
  if (x === "tiene" || x === "tramite" || x === "exento") return x;
  return null;
}

function mapStatus(x?: string): ListingStatus | null {
  if (
    x === "activo" || x === "oculto" ||
    x === "vendido" || x === "alquilado"
  ) return x;
  return null;
}

export async function PATCH(req: Request, { params }: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Verify listing exists
    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Inmueble no encontrado." }, { status: 404 });
    }

    // Validate price if provided
    const price = body.price !== undefined ? toNum(body.price) : undefined;
    if (price !== undefined && (price === null || price <= 0)) {
      return NextResponse.json(
        { error: "El precio debe ser mayor que 0." },
        { status: 400 }
      );
    }

    // Build update payload — only include fields that were sent
    const data: Record<string, unknown> = {};

    if (body.lat !== undefined)         data.lat         = toNum(body.lat);
    if (body.lng !== undefined)         data.lng         = toNum(body.lng);
    if (body.title !== undefined)       data.title       = toStr(body.title) ?? "Sin título";
    if (body.description !== undefined) data.description = toStr(body.description);
    if (body.address !== undefined)     data.address     = toStr(body.address);
    if (body.city !== undefined)        data.city        = toStr(body.city);
    if (body.province !== undefined)    data.province    = toStr(body.province);
    if (body.zip !== undefined)         data.zip         = toStr(body.zip);
    if (price !== undefined)            data.price       = price;
    if (body.priceHidden !== undefined) data.priceHidden = Boolean(body.priceHidden);
    if (body.communityFees !== undefined) data.communityFees = toNum(body.communityFees);
    if (body.areaM2 !== undefined)      data.areaM2      = toNum(body.areaM2);
    if (body.bedrooms !== undefined)    data.bedrooms    = toNum(body.bedrooms);
    if (body.bathrooms !== undefined)   data.bathrooms   = toNum(body.bathrooms);
    if (body.yearBuilt !== undefined)   data.yearBuilt   = toNum(body.yearBuilt);
    if (body.condition !== undefined)   data.condition   = toStr(body.condition);
    if (body.reference !== undefined)   data.reference   = toStr(body.reference);
    if (body.contactEmail !== undefined) data.contactEmail = toStr(body.contactEmail);
    if (body.contactPhone !== undefined) data.contactPhone = toStr(body.contactPhone);
    if (body.published !== undefined)   data.published   = Boolean(body.published);
    if (body.coverUrl !== undefined)    data.coverUrl    = toStr(body.coverUrl);
    if (body.extras !== undefined)      data.extras      = body.extras ?? {};
    if (body.energyConsumption !== undefined)      data.energyConsumption      = toNum(body.energyConsumption);
    if (body.energyConsumptionLabel !== undefined) data.energyConsumptionLabel = toStr(body.energyConsumptionLabel);
    if (body.energyEmissions !== undefined)        data.energyEmissions        = toNum(body.energyEmissions);
    if (body.energyEmissionsLabel !== undefined)   data.energyEmissionsLabel   = toStr(body.energyEmissionsLabel);

    const operation = mapOperation(body.operation);
    if (operation) data.operation = operation;

    const propertyType = mapPropertyType(body.type);
    if (propertyType) data.type = propertyType;

    const energyStatus = mapEnergyStatus(body.energyStatus);
    if (body.energyStatus !== undefined) data.energyStatus = energyStatus;

    const status = mapStatus(body.status);
    if (status) data.status = status;

    // Image replacement: delete all existing, create the new set
    const images: string[] | undefined =
      Array.isArray(body.images) ? body.images.filter(Boolean).map(String) : undefined;

    await prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        await tx.image.deleteMany({ where: { listingId: id } });
      }
      await tx.listing.update({
        where: { id },
        data: {
          ...data,
          ...(images !== undefined && images.length > 0
            ? { images: { create: images.map((url) => ({ url })) } }
            : {}),
        },
      });
    });

    return NextResponse.json({ id });
  } catch (e: any) {
    console.error("PATCH /api/listings/[id] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Error al actualizar el inmueble." },
      { status: 500 }
    );
  }
}
