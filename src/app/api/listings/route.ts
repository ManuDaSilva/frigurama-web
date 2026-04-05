import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { Operation, PropertyType, EnergyStatus, Listing } from "@prisma/client";

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
  energyStatus?: string;
  energyConsumption?: number | string;
  energyConsumptionLabel?: string;
  energyEmissions?: number | string;
  energyEmissionsLabel?: string;

  // CONTACTO
  reference?: string;
  contactEmail?: string;
  contactPhone?: string;

  // OPERACIÓN
  operation?: string;

  // VISIBILIDAD
  published?: boolean;
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

function mapEnergyStatus(x?: string): EnergyStatus | null {
  if (x === "tiene" || x === "tramite" || x === "exento") return x;
  return null;
}

function mapPropertyType(x?: string): PropertyType {
  const list = ["Piso", "Atico", "Chalet", "Adosado", "Estudio", "Local", "Garaje", "Terreno"] as const;
  return list.includes(x as any) ? (x as PropertyType) : "Piso";
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Body;

    const price = toNum(body.price);
    const areaM2 = toNum(body.areaM2);

    const errors: string[] = [];
    if (!price || price <= 0)
      errors.push("El precio es obligatorio y debe ser mayor que 0.");
    if (!toStr(body.title))
      errors.push("El título es obligatorio.");
    if (!toStr(body.city))
      errors.push("La ciudad es obligatoria.");
    if (!areaM2 || areaM2 <= 0)
      errors.push("La superficie (m²) es obligatoria y debe ser mayor que 0.");
    if (!toStr(body.contactEmail) && !toStr(body.contactPhone))
      errors.push("Indica al menos un email o teléfono de contacto.");

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = {
      title: toStr(body.title) ?? "Sin título",
      description: toStr(body.description),
      published: Boolean(body.published ?? true),

      type: mapPropertyType(body.type),
      operation: mapOperation(body.operation),

      // UBICACIÓN COMPLETA
      address: toStr(body.address),
      city: toStr(body.city),
      province: toStr(body.province),
      zip: toStr(body.zip),
      lat: toNum(body.lat),
      lng: toNum(body.lng),

      // DATOS (validation above guarantees these are non-null positive numbers)
      price: price as number,
      areaM2: areaM2 as number,
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
      energyStatus: mapEnergyStatus(body.energyStatus),
      energyConsumption: toNum(body.energyConsumption),
      energyConsumptionLabel: toStr(body.energyConsumptionLabel),
      energyEmissions: toNum(body.energyEmissions),
      energyEmissionsLabel: toStr(body.energyEmissionsLabel),
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
