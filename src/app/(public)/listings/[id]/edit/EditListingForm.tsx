"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import GoogleMap from "@/components/GoogleMap";

/* ── Types ─────────────────────────────────────────────── */

type ListingStatus = "activo" | "oculto" | "vendido" | "alquilado";
type Operation     = "venta" | "alquiler";
type PropertyType  =
  | "Piso" | "Atico" | "Casa" | "Adosado"
  | "Estudio" | "Local" | "Garaje" | "Terreno" | "Oficina";
type EnergyStatus  = "tiene" | "tramite" | "exento";
type Condition     = "nuevo" | "reformado" | "buen-estado" | "a-reformar";

type ExistingImage = { id: string; url: string };

export type InitialData = {
  id: string | null; // null when creating a new listing
  status: ListingStatus;
  published: boolean;
  title: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  operation: string | null;
  price: number;
  priceHidden: boolean | null;
  communityFees: number | null;
  type: string | null;
  condition: string | null;
  areaM2: number | null;
  yearBuilt: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  energyStatus: string | null;
  energyConsumption: number | null;
  energyConsumptionLabel: string | null;
  energyEmissions: number | null;
  energyEmissionsLabel: string | null;
  reference: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  coverUrl: string | null;
  images: ExistingImage[];
  extras: Record<string, unknown>;
};

/* ── Extras constants (same as wizard) ─────────────────── */

const interiores    = ["Cocina equipada","Cocina office","Lavadero","Suite con baño"] as const;
const calefRefri    = ["Aire acondicionado","Agua caliente","Calefacción"] as const;
const equipamiento  = ["Armarios empotrados","Domótica","Electrodomésticos","Gres / Cerámica"] as const;
const electro       = ["Horno","Lavadora","Lavavajillas","Microondas","Nevera","Secadora","TV"] as const;
const exteriores    = ["Balcón","Cerca transporte público","Jardín privado","Terraza","Parking privado","Patio","Piscina privada"] as const;
const comunidad     = ["Gimnasio","Piscina comunitaria","Zona comunitaria","Zona deportiva","Zona infantil","Trastero"] as const;
const seguridad     = ["Alarma","Puerta blindada","Servicio de portería","Sistema de vigilancia"] as const;
const hotWaterTypes = ["Gas natural","Electricidad","Gasóleo","Butano","Propano","Solar"] as const;
const heatingTypes  = ["Gas natural","Electricidad","Gasóleo","Butano","Propano","Solar"] as const;

/* ── Small helpers ──────────────────────────────────────── */

function clsx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 border-b pb-2 mb-5">
      {children}
    </h2>
  );
}

function SidebarTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
      {children}
    </p>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  min,
  max,
  placeholder,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={type === "number" ? (e) => e.target.select() : undefined}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition"
    />
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition"
    >
      {children}
    </select>
  );
}

function Textarea({
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full resize-y focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition"
    />
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
    <div className="inline-flex items-center rounded-lg border border-gray-200">
      <button
        type="button"
        className="px-3 py-1.5 hover:bg-gray-100 rounded-l-lg transition text-gray-600"
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        −
      </button>
      <span className="px-4 text-sm min-w-[2rem] text-center">{value}</span>
      <button
        type="button"
        className="px-3 py-1.5 hover:bg-gray-100 rounded-r-lg transition text-gray-600"
        onClick={() => onChange(value + 1)}
      >
        ＋
      </button>
    </div>
  );
}

function CheckboxList({
  options,
  values,
  onToggle,
}: {
  options: readonly string[];
  values: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
      {options.map((op) => (
        <label key={op} className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={values.includes(op)}
            onChange={() => onToggle(op)}
            className="h-4 w-4"
          />
          {op}
        </label>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */

export default function EditListingForm({
  initial,
  mode = "edit",
  redirectTo,
}: {
  initial: InitialData;
  mode?: "create" | "edit";
  redirectTo?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState<string | null>(null);

  /* — form state — */
  const [status, setStatus]           = useState<ListingStatus>(initial.status);
  const [published, setPublished]     = useState(initial.published);
  const [title, setTitle]             = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [address, setAddress]         = useState(initial.address ?? "");
  const [city, setCity]               = useState(initial.city ?? "");
  const [province, setProvince]       = useState(initial.province ?? "");
  const [zip, setZip]                 = useState(initial.zip ?? "");
  const [operation, setOperation]     = useState<Operation>((initial.operation as Operation) ?? "venta");
  const [price, setPrice]             = useState(String(initial.price ?? ""));
  const [priceHidden, setPriceHidden] = useState(!!initial.priceHidden);
  const [communityFees, setCommunityFees] = useState(String(initial.communityFees ?? ""));
  const [type, setType]               = useState<PropertyType>((initial.type as PropertyType) ?? "Piso");
  const [condition, setCondition]     = useState<Condition | "">(
    (initial.condition as Condition) ?? ""
  );
  const [areaM2, setAreaM2]           = useState(String(initial.areaM2 ?? ""));
  const [yearBuilt, setYearBuilt]     = useState(String(initial.yearBuilt ?? ""));
  const [bedrooms, setBedrooms]       = useState(initial.bedrooms ?? 0);
  const [bathrooms, setBathrooms]     = useState(initial.bathrooms ?? 0);
  const [energyStatus, setEnergyStatus] = useState<EnergyStatus | "">(
    (initial.energyStatus as EnergyStatus) ?? ""
  );
  const [energyConsumption,      setEnergyConsumption]      = useState(String(initial.energyConsumption ?? ""));
  const [energyConsumptionLabel, setEnergyConsumptionLabel] = useState(initial.energyConsumptionLabel ?? "");
  const [energyEmissions,        setEnergyEmissions]        = useState(String(initial.energyEmissions ?? ""));
  const [energyEmissionsLabel,   setEnergyEmissionsLabel]   = useState(initial.energyEmissionsLabel ?? "");
  const [reference, setReference]       = useState(initial.reference ?? "");
  const [contactEmail, setContactEmail] = useState(initial.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initial.contactPhone ?? "");
  const [coverUrl, setCoverUrl]         = useState(initial.coverUrl ?? "");
  const [lat, setLat]                   = useState<number | null>(initial.lat ?? null);
  const [lng, setLng]                   = useState<number | null>(initial.lng ?? null);

  /* — image state — */
  const [imageUrls, setImageUrls] = useState<string[]>(
    initial.images.map((img) => img.url)
  );

  /* — extras state — */
  const ex = initial.extras as Record<string, unknown>;
  const [extInteriores,   setExtInteriores]   = useState<string[]>((ex.interiores   as string[]) ?? []);
  const [extCalefRefri,   setExtCalefRefri]   = useState<string[]>((ex.calefRefri   as string[]) ?? []);
  const [extEquipamiento, setExtEquipamiento] = useState<string[]>((ex.equipamiento as string[]) ?? []);
  const [extElectro,      setExtElectro]      = useState<string[]>((ex.electro      as string[]) ?? []);
  const [extExteriores,   setExtExteriores]   = useState<string[]>((ex.exteriores   as string[]) ?? []);
  const [extComunidad,    setExtComunidad]    = useState<string[]>((ex.comunidad    as string[]) ?? []);
  const [extSeguridad,    setExtSeguridad]    = useState<string[]>((ex.seguridad    as string[]) ?? []);
  const [hotWaterType,    setHotWaterType]    = useState((ex.hotWaterType as string) ?? "");
  const [heatingType,     setHeatingType]     = useState((ex.heatingType  as string) ?? "");
  const [terrazaM2,       setTerrazaM2]       = useState(String((ex.terrazaM2 as number) ?? ""));

  function toggleExtra(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    name: string
  ) {
    setter((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  /* — submit — */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side guard
    if (!title.trim()) return setError("El título es obligatorio.");
    if (!city.trim())  return setError("La ciudad es obligatoria.");
    const priceNum = Number(price);
    if (!price || priceNum <= 0) return setError("El precio debe ser mayor que 0.");

    setSaving(true);
    try {
      const body = {
        status,
        published,
        lat,
        lng,
        title: title.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        city: city.trim(),
        province: province.trim() || null,
        zip: zip.trim() || null,
        operation,
        price: priceNum,
        priceHidden,
        communityFees: communityFees ? Number(communityFees) : null,
        type,
        condition: condition || null,
        areaM2: areaM2 ? Number(areaM2) : null,
        yearBuilt: yearBuilt ? Number(yearBuilt) : null,
        bedrooms,
        bathrooms,
        energyStatus: energyStatus || null,
        energyConsumption:
          energyStatus === "tiene" && energyConsumption ? Number(energyConsumption) : null,
        energyConsumptionLabel:
          energyStatus === "tiene" ? energyConsumptionLabel || null : null,
        energyEmissions:
          energyStatus === "tiene" && energyEmissions ? Number(energyEmissions) : null,
        energyEmissionsLabel:
          energyStatus === "tiene" ? energyEmissionsLabel || null : null,
        reference: reference.trim() || null,
        contactEmail: contactEmail.trim() || null,
        contactPhone: contactPhone.trim() || null,
        coverUrl: coverUrl || imageUrls[0] || null,
        images: imageUrls,
        extras: {
          interiores: extInteriores,
          calefRefri: extCalefRefri,
          hotWaterType: hotWaterType || undefined,
          heatingType: heatingType || undefined,
          equipamiento: extEquipamiento,
          electro: extElectro,
          exteriores: extExteriores,
          comunidad: extComunidad,
          seguridad: extSeguridad,
          terrazaM2: terrazaM2 ? Number(terrazaM2) : null,
        },
      };

      const isCreate = mode === "create";
      const res = await fetch(
        isCreate ? "/api/listings" : `/api/listings/${initial.id}`,
        {
          method:  isCreate ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "No se pudo guardar el inmueble.");
      }

      setSaved(true);
      if (isCreate) {
        const data = await res.json();
        setTimeout(() => router.push(redirectTo ?? `/admin/listings/${data.id}/edit`), 700);
      } else {
        setTimeout(() => { router.push(redirectTo ?? `/listings/${initial.id}`); router.refresh(); }, 700);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setSaving(false);
    }
  }

  /* — image helpers — */
  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
    if (coverUrl === url) setCoverUrl(imageUrls.find((u) => u !== url) ?? "");
  }

  function addImage(url: string) {
    if (!imageUrls.includes(url)) {
      setImageUrls((prev) => [...prev, url]);
      if (!coverUrl) setCoverUrl(url);
    }
  }

  /* ── Render ─────────────────────────────────────────── */

  const statusConfig: Record<
    ListingStatus,
    { label: string; description: string; color: string }
  > = {
    activo:    { label: "Activo",    description: "Estado comercial activo",     color: "bg-green-50 border-green-500 text-green-800" },
    oculto:    { label: "Oculto",    description: "No visible para el público", color: "bg-gray-100 border-gray-400 text-gray-700" },
    vendido:   { label: "Vendido",   description: "Marcado como vendido",       color: "bg-blue-50 border-blue-500 text-blue-800" },
    alquilado: { label: "Alquilado", description: "Marcado como alquilado",     color: "bg-purple-50 border-purple-500 text-purple-800" },
  };

  const subLabel = "text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

      {/* ══════════════════════════════════════════════════════
          COLUMNA PRINCIPAL
      ══════════════════════════════════════════════════════ */}
      <div className="space-y-6">

        {/* ── Información básica ── */}
        <Card>
          <SectionTitle>Información básica</SectionTitle>
          <div className="space-y-4">
            <Field label="Título" required>
              <Input value={title} onChange={setTitle} placeholder="Piso luminoso en el centro" />
            </Field>
            <Field label="Descripción">
              <Textarea
                value={description}
                onChange={setDescription}
                rows={6}
                placeholder="Describe el inmueble…"
              />
            </Field>
          </div>
        </Card>

        {/* ── Ubicación ── */}
        <Card>
          <SectionTitle>Ubicación</SectionTitle>
          <div className="space-y-4">
            <GoogleMap
              lat={lat}
              lng={lng}
              address={address}
              onChange={({ lat: newLat, lng: newLng, address: newAddress }) => {
                setLat(newLat);
                setLng(newLng);
                setAddress(newAddress);
              }}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Ciudad" required>
                <Input value={city} onChange={setCity} />
              </Field>
              <Field label="Provincia">
                <Input value={province} onChange={setProvince} />
              </Field>
              <Field label="Código postal">
                <Input value={zip} onChange={setZip} />
              </Field>
            </div>
          </div>
        </Card>

        {/* ── Precio y operación ── */}
        <Card>
          <SectionTitle>Precio y operación</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Operación">
              <Select value={operation} onChange={(v) => setOperation(v as Operation)}>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </Select>
            </Field>
            <Field label="Precio (€)" required>
              <Input type="number" min={0} value={price} onChange={setPrice} />
            </Field>
            <Field label="Gastos comunidad (€/mes)">
              <Input type="number" min={0} value={communityFees} onChange={setCommunityFees} />
            </Field>
            <div className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                id="priceHidden"
                checked={priceHidden}
                onChange={(e) => setPriceHidden(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="priceHidden" className="text-sm text-gray-700 cursor-pointer">
                Ocultar precio
              </label>
            </div>
          </div>
        </Card>

        {/* ── Datos del inmueble ── */}
        <Card>
          <SectionTitle>Datos del inmueble</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Tipo de inmueble">
              <Select value={type} onChange={(v) => setType(v as PropertyType)}>
                {(["Piso","Atico","Casa","Adosado","Estudio","Local","Garaje","Terreno","Oficina"] as const).map(
                  (t) => (
                    <option key={t} value={t}>
                      {t === "Atico" ? "Ático" : t}
                    </option>
                  )
                )}
              </Select>
            </Field>
            <Field label="Estado del inmueble">
              <Select value={condition} onChange={(v) => setCondition(v as Condition | "")}>
                <option value="">Selecciona…</option>
                <option value="nuevo">Obra nueva / Nuevo</option>
                <option value="reformado">Reformado</option>
                <option value="buen-estado">Buen estado</option>
                <option value="a-reformar">A reformar</option>
              </Select>
            </Field>
            <Field label="Superficie (m²)">
              <Input type="number" min={0} value={areaM2} onChange={setAreaM2} />
            </Field>
            <Field label="Año de construcción">
              <Input
                type="number"
                min={1800}
                max={new Date().getFullYear()}
                value={yearBuilt}
                onChange={setYearBuilt}
              />
            </Field>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Habitaciones</label>
              <Counter value={bedrooms} onChange={setBedrooms} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Baños</label>
              <Counter value={bathrooms} onChange={setBathrooms} />
            </div>
          </div>
        </Card>

        {/* ── Certificado energético ── */}
        <Card>
          <SectionTitle>Certificado energético</SectionTitle>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {([
                ["tiene",   "Dispongo de él"],
                ["tramite", "Está en trámite"],
                ["exento",  "Está exento"],
              ] as const).map(([val, label]) => (
                <label key={val} className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="energyStatus"
                    checked={energyStatus === val}
                    onChange={() => setEnergyStatus(val)}
                  />
                  {label}
                </label>
              ))}
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="energyStatus"
                  checked={energyStatus === ""}
                  onChange={() => {
                    setEnergyStatus("");
                    setEnergyConsumptionLabel("");
                    setEnergyConsumption("");
                    setEnergyEmissionsLabel("");
                    setEnergyEmissions("");
                  }}
                />
                Sin especificar
              </label>
            </div>

            {energyStatus === "tiene" && (
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Consumo */}
                <Field label="Consumo — letra (A–G)">
                  <Select value={energyConsumptionLabel} onChange={setEnergyConsumptionLabel}>
                    <option value="">—</option>
                    {["A","B","C","D","E","F","G"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Consumo (kWh/m²·año)">
                  <Input type="number" min={0} value={energyConsumption} onChange={setEnergyConsumption} />
                </Field>
                {/* Emisiones */}
                <Field label="Emisiones — letra (A–G)">
                  <Select value={energyEmissionsLabel} onChange={setEnergyEmissionsLabel}>
                    <option value="">—</option>
                    {["A","B","C","D","E","F","G"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Emisiones (kg CO₂/m²·año)">
                  <Input type="number" min={0} value={energyEmissions} onChange={setEnergyEmissions} />
                </Field>
              </div>
            )}
          </div>
        </Card>

        {/* ── Extras y características ── */}
        <Card>
          <SectionTitle>Extras y características</SectionTitle>
          <div className="space-y-6">
            <div>
              <p className={subLabel}>Interiores</p>
              <CheckboxList
                options={interiores}
                values={extInteriores}
                onToggle={(n) => toggleExtra(setExtInteriores, n)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className={subLabel}>Calefacción y Refrigeración</p>
                <CheckboxList
                  options={calefRefri}
                  values={extCalefRefri}
                  onToggle={(n) => toggleExtra(setExtCalefRefri, n)}
                />
              </div>
              <div className="space-y-3">
                <Field label="Tipo de agua caliente">
                  <Select value={hotWaterType} onChange={setHotWaterType}>
                    <option value="">Selecciona…</option>
                    {hotWaterTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </Field>
                <Field label="Tipo de calefacción">
                  <Select value={heatingType} onChange={setHeatingType}>
                    <option value="">Selecciona…</option>
                    {heatingTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </Field>
              </div>
            </div>
            <div>
              <p className={subLabel}>Equipamiento</p>
              <CheckboxList
                options={equipamiento}
                values={extEquipamiento}
                onToggle={(n) => toggleExtra(setExtEquipamiento, n)}
              />
            </div>
            <div>
              <p className={subLabel}>Electrodomésticos</p>
              <CheckboxList
                options={electro}
                values={extElectro}
                onToggle={(n) => toggleExtra(setExtElectro, n)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className={subLabel}>Exteriores</p>
                <CheckboxList
                  options={exteriores}
                  values={extExteriores}
                  onToggle={(n) => toggleExtra(setExtExteriores, n)}
                />
              </div>
              <Field label="Terraza (m²)">
                <Input type="number" min={0} value={terrazaM2} onChange={setTerrazaM2} />
              </Field>
            </div>
            <div>
              <p className={subLabel}>Equipamiento comunitario</p>
              <CheckboxList
                options={comunidad}
                values={extComunidad}
                onToggle={(n) => toggleExtra(setExtComunidad, n)}
              />
            </div>
            <div>
              <p className={subLabel}>Seguridad</p>
              <CheckboxList
                options={seguridad}
                values={extSeguridad}
                onToggle={(n) => toggleExtra(setExtSeguridad, n)}
              />
            </div>
          </div>
        </Card>

        {/* ── Fotos ── */}
        <Card>
          <SectionTitle>Fotos</SectionTitle>
          <div className="space-y-4">
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imageUrls.map((url) => (
                  <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Foto del inmueble"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                      {coverUrl !== url && (
                        <button
                          type="button"
                          onClick={() => setCoverUrl(url)}
                          className="text-xs bg-white text-black px-2 py-1 rounded"
                        >
                          Portada
                        </button>
                      )}
                    </div>
                    {coverUrl === url && (
                      <div className="absolute top-1 left-1 text-xs bg-black text-white px-1.5 py-0.5 rounded">
                        Portada
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-2">Añadir fotos</p>
              <ImageUploader onUploaded={addImage} />
            </div>
          </div>
        </Card>

        {/* ── Contacto ── */}
        <Card>
          <SectionTitle>Contacto</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Referencia">
              <Input value={reference} onChange={setReference} placeholder="REF-0001" />
            </Field>
            <Field label="Email de contacto">
              <Input type="email" value={contactEmail} onChange={setContactEmail} placeholder="tu@email.com" />
            </Field>
            <Field label="Teléfono de contacto">
              <Input value={contactPhone} onChange={setContactPhone} placeholder="+34 600 000 000" />
            </Field>
          </div>
        </Card>

      </div>

      {/* ══════════════════════════════════════════════════════
          SIDEBAR DERECHO
      ══════════════════════════════════════════════════════ */}
      <div className="space-y-4 lg:sticky lg:top-20">

        {/* ── Estado del anuncio ── */}
        <Card>
          <SidebarTitle>Estado del anuncio</SidebarTitle>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(statusConfig) as [ListingStatus, typeof statusConfig[ListingStatus]][]).map(
              ([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatus(key)}
                  className={clsx(
                    "rounded-lg border-2 p-2.5 text-left transition",
                    status === key ? cfg.color : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="font-semibold text-xs">{cfg.label}</div>
                  <div className="text-xs mt-0.5 opacity-60 leading-tight">{cfg.description}</div>
                </button>
              )
            )}
          </div>
        </Card>

        {/* ── Visibilidad (published) ── */}
        <button
          type="button"
          onClick={() => setPublished((v) => !v)}
          className={clsx(
            "w-full rounded-xl border-2 p-4 text-left transition",
            published
              ? "bg-green-50 border-green-400"
              : "bg-gray-50 border-gray-300 hover:border-gray-400"
          )}
        >
          <div className={clsx(
            "font-semibold text-sm",
            published ? "text-green-800" : "text-gray-600"
          )}>
            {published ? "Publicado" : "No publicado"}
          </div>
          <div className={clsx(
            "text-xs mt-0.5",
            published ? "text-green-600" : "text-gray-400"
          )}>
            {published
              ? "Visible en el catálogo público"
              : "No aparece en el catálogo público"}
          </div>
        </button>

        {/* ── Acciones ── */}
        <Card>
          {error && (
            <p className="text-xs text-red-600 border border-red-200 rounded-lg px-3 py-2 bg-red-50 mb-3">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={saving || saved}
              className={clsx(
                "w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60",
                saved ? "bg-green-600" : "bg-black hover:bg-gray-800"
              )}
            >
              {saved
                ? "✓ Guardado correctamente"
                : saving
                ? (mode === "create" ? "Publicando…" : "Guardando…")
                : (mode === "create" ? "Publicar inmueble" : "Guardar cambios")}
            </button>
            <button
              type="button"
              onClick={() => router.push(redirectTo ?? (initial.id ? `/listings/${initial.id}` : "/listings"))}
              className="w-full py-2 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors border border-gray-200"
            >
              Cancelar
            </button>
          </div>
        </Card>

      </div>

    </form>
  );
}
