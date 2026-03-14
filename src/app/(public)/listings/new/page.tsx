"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StepMultimediaComponent from "./steps/StepMultimedia";
import GoogleMap from "@/components/GoogleMap";

/* =========================================================
   TIPOS Y CONSTANTES
========================================================= */

type StepKey =
  | "tipologia"
  | "ubicacion"
  | "precio"
  | "datos"
  | "extras"
  | "descripcion"
  | "multimedia"
  | "revision";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "tipologia", label: "Tipología" },
  { key: "ubicacion", label: "Ubicación" },
  { key: "precio", label: "Precio" },
  { key: "datos", label: "Datos" },
  { key: "extras", label: "Extras" },
  { key: "descripcion", label: "Descripción" },
  { key: "multimedia", label: "Multimedia" },
  { key: "revision", label: "Revisión" },
];

function clsx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}
const STORAGE_KEY = "listing-wizard-v2";

const hotWaterTypes = [
  "Gas natural",
  "Electricidad",
  "Gasóleo",
  "Butano",
  "Propano",
  "Solar",
] as const;
const heatingTypes = [
  "Gas natural",
  "Electricidad",
  "Gasóleo",
  "Butano",
  "Propano",
  "Solar",
] as const;

const interiores = [
  "Cocina equipada",
  "Cocina office",
  "Lavadero",
  "Suite con baño",
] as const;
const calefRefri = ["Aire acondicionado", "Agua caliente", "Calefacción"] as const;
const equipamiento = [
  "Armarios empotrados",
  "Domótica",
  "Electrodomésticos",
  "Gres / Cerámica",
] as const;
const electro = [
  "Horno",
  "Lavadora",
  "Lavavajillas",
  "Microondas",
  "Nevera",
  "Secadora",
  "TV",
] as const;
const exteriores = [
  "Balcón",
  "Cerca transporte público",
  "Jardín privado",
  "Terraza",
  "Parking privado",
  "Patio",
  "Piscina privada",
] as const;
const comunidad = [
  "Gimnasio",
  "Piscina comunitaria",
  "Zona comunitaria",
  "Zona deportiva",
  "Zona infantil",
  "Trastero",
] as const;
const seguridad = [
  "Alarma",
  "Puerta blindada",
  "Servicio de portería",
  "Sistema de vigilancia",
] as const;

type EnergyStatus = "tiene" | "tramite" | "exento";
type Operation = "venta" | "alquiler" | "compartir";
type PropertyCondition = "nuevo" | "buen-estado" | "reformado" | "a-reformar";

type FormState = {
  type?:
    | "Piso"
    | "Atico"
    | "Chalet"
    | "Adosado"
    | "Estudio"
    | "Local"
    | "Garaje"
    | "Terreno";

  address?: string;
  city?: string;
  province?: string;
  zip?: string;
  lat?: number;
  lng?: number;

  operation?: Operation;
  price?: number;
  priceHidden?: boolean;
  communityFees?: number | null;

  areaM2?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number | null;
  condition?: PropertyCondition | null;

  extras: {
    interiores: string[];
    calefRefri: string[];
    hotWaterType?: string;
    heatingType?: string;
    equipamiento: string[];
    electro: string[];
    exteriores: string[];
    comunidad: string[];
    seguridad: string[];
    terrazaM2?: number | null;
  };

  title?: string;
  description?: string;

  images: string[];
  coverUrl?: string;

  energyStatus?: EnergyStatus;
  energyLabel?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  energyConsumption?: number | null;
  energyEmissions?: number | null;

  reference?: string;
  contactEmail?: string;
  contactPhone?: string;
};

const EMPTY: FormState = {
  type: "Piso",
  address: "",
  city: "",
  lat: undefined,
  lng: undefined,

  operation: "venta",
  price: undefined,
  priceHidden: false,
  communityFees: null,

  areaM2: undefined,
  bedrooms: 0,
  bathrooms: 0,
  yearBuilt: null,
  condition: null,

  energyStatus: undefined,
  energyLabel: undefined,
  energyConsumption: null,
  energyEmissions: null,

  extras: {
    interiores: [],
    calefRefri: [],
    equipamiento: [],
    electro: [],
    exteriores: [],
    comunidad: [],
    seguridad: [],
    hotWaterType: undefined,
    heatingType: undefined,
    terrazaM2: null,
  },

  images: [],
};

/* =========================================================
   PÁGINA (único export default)
========================================================= */

export default function NewListingWizardPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  // Cargar de localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // Guardar auto en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const progressPct = useMemo(
    () => ((stepIndex + 1) / STEPS.length) * 100,
    [stepIndex]
  );

  function validateStep(i = stepIndex): string | null {
    const k = STEPS[i].key;
    switch (k) {
      case "tipologia":
        if (!form.type) return "Selecciona el tipo de inmueble.";
        return null;
      case "ubicacion":
        if (!form.address) return "Indica una dirección (puedes usar el mapa).";
        return null;
      case "precio":
        if (!form.operation) return "Selecciona Vender / Alquilar / Compartir.";
        if (!form.price || form.price <= 0) return "Indica un precio válido.";
        return null;
      case "datos":
        if (!form.areaM2) return "Indica la superficie en m².";
        if (!form.energyStatus)
          return "Selecciona el estado del certificado energético.";
        if (
          form.energyStatus === "tiene" &&
          (!form.energyLabel ||
            form.energyConsumption == null ||
            form.energyEmissions == null)
        ) {
          return "Completa los valores del certificado energético.";
        }
        return null;
      case 'descripcion':
        if (!form.title || form.title.trim().length < 5) {
          return 'Añade un título para el anuncio (mín. 5 caracteres).';
        }
        if (!form.description || form.description.trim().length < 30) {
          return 'Escribe una descripción (mín. 30 caracteres).';
        }
        return null;
      case "multimedia":
        if (!form.coverUrl) return "Selecciona al menos una portada.";
        return null;
      case "revision":
        if (!form.contactEmail && !form.contactPhone)
          return "Añade un email o teléfono de contacto.";
        return null;
      default:
        return null;
    }
  }

  async function handleNext() {
    const err = validateStep();
    if (err) return alert(err);
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  }
  function handlePrev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  async function handlePublish() {
    const err = validateStep(STEPS.length - 1);
    if (err) return alert(err);

    try {
      setSaving(true);
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as any));
        throw new Error(data?.error || "No se pudo crear el inmueble");
      }
      localStorage.removeItem(STORAGE_KEY);
      const data = await res.json();
      router.replace(`/listings/${data.id}`);
    } catch (e: any) {
      alert(e.message || "Error publicando");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      {/* cabecera + progreso */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Publicar inmueble</h1>
          <Link href="/listings" className="text-blue-600 underline">
            ← Volver
          </Link>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm mb-2 overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setStepIndex(i)}
                  className={clsx(
                    "px-3 py-1 rounded border whitespace-nowrap",
                    i === stepIndex &&
                      "bg-black text-white border-black",
                    i !== stepIndex && "hover:bg-gray-100"
                  )}
                >
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <span className="mx-2 text-gray-300">›</span>
                )}
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-black rounded"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* contenido del paso */}
      <div className="border rounded-lg p-5 bg-white">
        {STEPS[stepIndex].key === "tipologia" && (
          <StepTipologiaButtons form={form} setForm={setForm} />
        )}
        {STEPS[stepIndex].key === "ubicacion" && (
          <StepUbicacion form={form} setForm={setForm} />
        )}
        {STEPS[stepIndex].key === "precio" && (
          <StepPrecio form={form} setForm={setForm} />
        )}
        {STEPS[stepIndex].key === "datos" && (
          <StepDatos form={form} setForm={setForm} />
        )}
        {STEPS[stepIndex].key === "extras" && (
          <StepExtras form={form} setForm={setForm} />
        )}
        {STEPS[stepIndex].key === "descripcion" && (
          <StepDescripcion form={form} setForm={setForm} />
        )}
        {STEPS[stepIndex].key === "multimedia" && (
          <StepMultimediaComponent
            urls={form.images}
            coverUrl={form.coverUrl}
            onChange={(urls: string[]) =>
              setForm((f: FormState) => ({
                ...f,
                images: urls,
                coverUrl:
                  f.coverUrl && urls.includes(f.coverUrl)
                    ? f.coverUrl
                    : urls[0] ?? undefined,
              }))
            }
            onSetCover={(u: string) =>
              setForm((f: FormState) => ({ ...f, coverUrl: u }))
            }
            onBack={() =>
              setStepIndex((i) => Math.max(0, i - 1))
            }
            onNext={() =>
              setStepIndex((i) =>
                Math.min(STEPS.length - 1, i + 1)
              )
            }
          />
        )}
        {STEPS[stepIndex].key === "revision" && (
          <StepRevision form={form} setForm={setForm} />
        )}
      </div>

      {/* botones */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className={clsx(
            "px-4 py-2 rounded border",
            stepIndex === 0
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-100"
          )}
        >
          ← Atrás
        </button>

        {stepIndex < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded bg-black text-white"
          >
            Siguiente →
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
          >
            {saving ? "Publicando…" : "Publicar"}
          </button>
        )}
      </div>
    </main>
  );
}

/* ==================== STEPS ==================== */

function StepTipologiaButtons({
  form,
  setForm,
}: {
  form: FormState;
  setForm: any;
}) {
  const tipos: Array<{
    key: FormState["type"];
    label: string;
    icon: string;
  }> = [
    { key: "Piso", label: "Piso", icon: "🏢" },
    { key: "Atico", label: "Ático", icon: "🏙️" },
    { key: "Chalet", label: "Chalet", icon: "🏠" },
    { key: "Adosado", label: "Adosado", icon: "🏘️" },
    { key: "Estudio", label: "Estudio", icon: "🛋️" },
    { key: "Local", label: "Local", icon: "🏪" },
    { key: "Garaje", label: "Garaje", icon: "🚗" },
    { key: "Terreno", label: "Terreno", icon: "🌳" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tipo de inmueble</h2>
      <div className="grid sm:grid-cols-4 gap-3">
        {tipos.map((t) => {
          const active = form.type === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() =>
                setForm((f: FormState) => ({ ...f, type: t.key }))
              }
              className={clsx(
                "flex items-center gap-3 rounded-2xl border p-3 text-left hover:bg-gray-50",
                active
                  ? "border-black ring-2 ring-black/10"
                  : "border-gray-300"
              )}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-500">
        * El diseñador podrá sustituir estos iconos por imágenes SVG.
      </p>
    </div>
  );
}

function StepUbicacion({
  form,
  setForm,
}: {
  form: FormState;
  setForm: any;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ubicación</h2>

      <GoogleMap
        lat={form.lat ?? null}
        lng={form.lng ?? null}
        address={form.address ?? ""}
        onChange={({ lat, lng, address }) =>
          setForm((f: FormState) => ({ ...f, lat, lng, address }))
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Ciudad</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.city ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                city: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Provincia</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.province ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                province: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Código postal</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.zip ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                zip: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

function StepPrecio({
  form,
  setForm,
}: {
  form: FormState;
  setForm: any;
}) {
  const ops: Array<{ key: Operation; label: string; img: string }> = [
    { key: "venta", label: "Vender", img: "/ops/venta.png" },
    { key: "alquiler", label: "Alquilar", img: "/ops/alquiler.png" },
    { key: "compartir", label: "Compartir", img: "/ops/compartir.png" },
  ];

  const isRent = form.operation === "alquiler";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Escoger la transacción y el precio
      </h2>

      <div className="grid sm:grid-cols-3 gap-3">
        {ops.map((op) => {
          const active = form.operation === op.key;
          return (
            <button
              key={op.key}
              type="button"
              onClick={() =>
                setForm((f: FormState) => ({
                  ...f,
                  operation: op.key,
                }))
              }
              className={clsx(
                "rounded-2xl border p-3 text-left hover:bg-gray-50",
                active
                  ? "border-black ring-2 ring-black/10"
                  : "border-gray-300"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={op.img}
                alt={op.label}
                className="w-full h-28 object-cover rounded-lg mb-2"
              />
              <div className="font-medium">{op.label}</div>
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">
            {isRent ? "Precio de alquiler (€) *" : "Precio de venta (€) *"}
          </label>
          <input
            type="number"
            min={0}
            className="w-full border rounded px-3 py-2"
            value={form.price ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                price: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              }))
            }
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.priceHidden}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                priceHidden: e.target.checked,
              }))
            }
          />
          Ocultar precio
        </label>
      </div>

      <div className="max-w-md">
        <label className="block text-sm mb-1">
          Gastos comunidad (€ / mes)
        </label>
        <input
          type="number"
          min={0}
          className="w-full border rounded px-3 py-2"
          value={form.communityFees ?? ""}
          onChange={(e) =>
            setForm((f: FormState) => ({
              ...f,
              communityFees: e.target.value
                ? Number(e.target.value)
                : null,
            }))
          }
        />
      </div>
    </div>
  );
}

function Counter({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded border">
      <button
        type="button"
        className="px-3 py-1"
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        −
      </button>
      <span className="px-4">{value}</span>
      <button
        type="button"
        className="px-3 py-1"
        onClick={() => onChange(value + 1)}
      >
        ＋
      </button>
    </div>
  );
}

function StepDatos({
  form,
  setForm,
}: {
  form: FormState;
  setForm: any;
}) {
  const showEnergyFields = form.energyStatus === "tiene";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Rellena los campos</h2>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm mb-1">
            Superficie construida (m²) *
          </label>
          <input
            type="number"
            min={0}
            className="w-full border rounded px-3 py-2"
            value={form.areaM2 ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                areaM2: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Año de construcción</label>
          <input
            type="number"
            min={1800}
            max={new Date().getFullYear()}
            className="w-full border rounded px-3 py-2"
            value={form.yearBuilt ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                yearBuilt: e.target.value
                  ? Number(e.target.value)
                  : null,
              }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Habitaciones</label>
          <Counter
            value={form.bedrooms ?? 0}
            onChange={(n) =>
              setForm((f: FormState) => ({ ...f, bedrooms: n }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Baños</label>
          <Counter
            value={form.bathrooms ?? 0}
            onChange={(n) =>
              setForm((f: FormState) => ({ ...f, bathrooms: n }))
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Estado del inmueble</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.condition ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                condition: (e.target.value || null) as any,
              }))
            }
          >
            <option value="">Selecciona…</option>
            <option value="nuevo">Obra nueva / Nuevo</option>
            <option value="reformado">Reformado</option>
            <option value="buen-estado">Buen estado</option>
            <option value="a-reformar">A reformar</option>
          </select>
        </div>
      </div>

      {/* Certificado energético */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Certificado energético *</h3>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {(["tiene", "tramite", "exento"] as EnergyStatus[]).map((v) => (
            <label key={v} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="energyStatus"
                checked={form.energyStatus === v}
                onChange={() =>
                  setForm((f: FormState) => ({
                    ...f,
                    energyStatus: v,
                    ...(v !== "tiene"
                      ? {
                          energyLabel: undefined,
                          energyConsumption: null,
                          energyEmissions: null,
                        }
                      : {}),
                  }))
                }
              />
              <span>
                {v === "tiene"
                  ? "Dispongo de él"
                  : v === "tramite"
                  ? "Está en trámite"
                  : "Está exento"}
              </span>
            </label>
          ))}
        </div>

        {showEnergyFields && (
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">
                Calificación (A–G)
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.energyLabel ?? ""}
                onChange={(e) =>
                  setForm((f: FormState) => ({
                    ...f,
                    energyLabel: (e.target.value ||
                      undefined) as any,
                  }))
                }
              >
                <option value="">—</option>
                {["A", "B", "C", "D", "E", "F", "G"].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">
                Consumo (kWh/m²·año)
              </label>
              <input
                type="number"
                min={0}
                className="w-full border rounded px-3 py-2"
                value={form.energyConsumption ?? ""}
                onChange={(e) =>
                  setForm((f: FormState) => ({
                    ...f,
                    energyConsumption: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Emisiones (kg CO₂/m²·año)
              </label>
              <input
                type="number"
                min={0}
                className="w-full border rounded px-3 py-2"
                value={form.energyEmissions ?? ""}
                onChange={(e) =>
                  setForm((f: FormState) => ({
                    ...f,
                    energyEmissions: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckboxList({
  title,
  options,
  values,
  onToggle,
}: {
  title: string;
  options: readonly string[];
  values: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div>
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
        {options.map((op) => (
          <label key={op} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={values.includes(op)}
              onChange={() => onToggle(op)}
              className="h-4 w-4"
            />
            <span>{op}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepExtras({
  form,
  setForm,
}: {
  form: FormState;
  setForm: any;
}) {
  const ex = form.extras;

  function toggle(path: keyof FormState["extras"], name: string) {
    setForm((f: FormState) => {
      const arr = f.extras[path] as string[];
      const has = arr.includes(name);
      return {
        ...f,
        extras: {
          ...f.extras,
          [path]: has ? arr.filter((x) => x !== name) : [...arr, name],
        },
      };
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Extras</h2>

      <CheckboxList
        title="Interiores"
        options={interiores}
        values={ex.interiores}
        onToggle={(n) => toggle("interiores", n)}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <CheckboxList
          title="Calefacción y Refrigeración"
          options={calefRefri}
          values={ex.calefRefri}
          onToggle={(n) => toggle("calefRefri", n)}
        />
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Tipo de agua caliente
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={ex.hotWaterType ?? ""}
              onChange={(e) =>
                setForm((f: FormState) => ({
                  ...f,
                  extras: {
                    ...f.extras,
                    hotWaterType: e.target.value || undefined,
                  },
                }))
              }
            >
              <option value="">Selecciona…</option>
              {hotWaterTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">
              Tipo de calefacción
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={ex.heatingType ?? ""}
              onChange={(e) =>
                setForm((f: FormState) => ({
                  ...f,
                  extras: {
                    ...f.extras,
                    heatingType: e.target.value || undefined,
                  },
                }))
              }
            >
              <option value="">Selecciona…</option>
              {heatingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <CheckboxList
        title="Equipamiento"
        options={equipamiento}
        values={ex.equipamiento}
        onToggle={(n) => toggle("equipamiento", n)}
      />
      <CheckboxList
        title="Electrodomésticos"
        options={electro}
        values={ex.electro}
        onToggle={(n) => toggle("electro", n)}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <CheckboxList
          title="Exteriores"
          options={exteriores}
          values={ex.exteriores}
          onToggle={(n) => toggle("exteriores", n)}
        />
        <div>
          <label className="block text-sm mb-1">Terraza (m²)</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded px-3 py-2"
            value={ex.terrazaM2 ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                extras: {
                  ...f.extras,
                  terrazaM2: e.target.value
                    ? Number(e.target.value)
                    : null,
                },
              }))
            }
          />
        </div>
      </div>

      <CheckboxList
        title="Equipamiento comunitario"
        options={comunidad}
        values={ex.comunidad}
        onToggle={(n) => toggle("comunidad", n)}
      />
      <CheckboxList
        title="Seguridad"
        options={seguridad}
        values={ex.seguridad}
        onToggle={(n) => toggle("seguridad", n)}
      />
    </div>
  );
}

function StepDescripcion({ form, setForm }: { form: FormState; setForm: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Descripción</h2>

      {/* TÍTULO DEL ANUNCIO */}
      <div>
        <label className="block text-sm mb-1">
          Título del anuncio (obligatorio)
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.title ?? ''}
          onChange={(e) =>
            setForm((f: FormState) => ({ ...f, title: e.target.value }))
          }
          placeholder="Piso luminoso en el centro de Barcelona"
        />
        <p className="text-xs text-gray-500 mt-1">
          Este texto será el título que se verá en el listado (donde ahora pone
          &quot;Sin título&quot;).
        </p>
      </div>

      {/* DESCRIPCIÓN LARGA */}
      <div>
        <label className="block text-sm mb-1">
          Descripción del anuncio (recomendado mínimo 50 caracteres)
        </label>
        <textarea
          rows={8}
          className="w-full border rounded px-3 py-2"
          value={form.description ?? ''}
          onChange={(e) =>
            setForm((f: FormState) => ({ ...f, description: e.target.value }))
          }
          placeholder="Cuenta qué hace diferente a la vivienda, cómo es, cómo está equipada y cómo es la zona…"
        />
      </div>
    </div>
  );
}


function StepRevision({
  form,
  setForm,
}: {
  form: FormState;
  setForm: any;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">¡Ya casi lo tienes!</h2>

      <div>
        <label className="block text-sm mb-1">Referencia *</label>
        <input
          className="w-full border rounded px-3 py-2 max-w-sm"
          value={form.reference ?? ""}
          onChange={(e) =>
            setForm((f: FormState) => ({
              ...f,
              reference: e.target.value,
            }))
          }
          placeholder="REF-0001"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Email</h3>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={form.contactEmail ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                contactEmail: e.target.value,
              }))
            }
            placeholder="tu@email.com"
          />
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Teléfono</h3>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.contactPhone ?? ""}
            onChange={(e) =>
              setForm((f: FormState) => ({
                ...f,
                contactPhone: e.target.value,
              }))
            }
            placeholder="+34 600 000 000"
          />
        </div>
      </div>

      <div className="border rounded p-4">
        <h3 className="font-medium mb-2">Resumen</h3>
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
          {JSON.stringify(form, null, 2)}
        </pre>
      </div>
    </div>
  );
}
