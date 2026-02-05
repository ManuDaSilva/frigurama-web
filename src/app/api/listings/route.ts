import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Operation, PropertyType, Listing } from "@prisma/client";

export const dynamic = "force-dynamic";

type ListingCondition = Listing["condition"];

type Body = {
  type?: string;

  // UBICACIÓN
  address?: string;
  city?: string;
  province?: string;
  zip?: string;
  lat?: number | string;
  lng?: number | string;

  // PRECIO Y DATOS
  price?: number | string;
  areaM2?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  yearBuilt?: number | string;
  condition?: ListingCondition;

  // DESCRIPCIÓN
  title?: string;
  description?: string;

  // EXTRAS
  extras?: any;

  // IMÁGENES
  images?: string[];
  coverUrl?: string;

  // ENERGÍA
  energyLabel?: string;
  energyConsumption?: number | string;
  energyEmissions?: number | string;

  // CONTACTO
  reference?: string;
  contactEmail?: string;
  contactPhone?: string;

  // OPERACIÓN
  operation?: string;
};


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

function mapOperation(x?: string): Operation {
  const k = (x ?? "venta").toLowerCase();
  return (["venta", "alquiler", "compartir"].includes(k) ? k : "venta") as Operation;
}

function mapPropertyType(x?: string): PropertyType {
  const list = ["Piso", "Casa", "Chalet", "Atico", "Estudio", "Local", "Parcela", "Otro"] as const;
  return list.includes(x as any) ? (x as PropertyType) : "Piso";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const data = {
      title: toStr(body.title) ?? "Sin título",
      description: toStr(body.description),

      type: mapPropertyType(body.type),
      operation: mapOperation(body.operation),

      // UBICACIÓN COMPLETA
      address: toStr(body.address),
      city: toStr(body.city),
      province: toStr(body.province),
      zip: toStr(body.zip),
      lat: toNum(body.lat),
      lng: toNum(body.lng),

      // DATOS
      price: toNum(body.price) ?? 0,
      areaM2: toNum(body.areaM2),
      bedrooms: toNum(body.bedrooms),
      bathrooms: toNum(body.bathrooms),
      yearBuilt: toNum(body.yearBuilt),
      condition: body.condition ?? null,


      // MULTIMEDIA
      coverUrl: toStr(body.coverUrl),
      extras: body.extras ?? {},

      // CONTACTO
      reference: toStr(body.reference),
      contactEmail: toStr(body.contactEmail),
      contactPhone: toStr(body.contactPhone),

      // ENERGÍA
      energyLabel: body.energyLabel ?? null,
      energyConsumption: toNum(body.energyConsumption),
      energyEmissions: toNum(body.energyEmissions),
    };

    const images = (body.images ?? []).filter(Boolean).map(String);

    const listing = await prisma.listing.create({
      data: {
        ...data,
        images: images.length
          ? { create: images.map((url) => ({ url })) }
          : undefined,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: listing.id }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/listings error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Invalid payload" },
      { status: 400 }
    );
  }
}
