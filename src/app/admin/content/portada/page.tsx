"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import { useSaveFeedback } from "@/hooks/useSaveFeedback";

type SlideMainSide    = { main: string; side: string };
type SlideMainPreview = { main: string; preview: string };

type PortadaContent = {
  apartments: { slides: SlideMainSide[] };
  houses:     { slides: SlideMainPreview[] };
  terrain:    { slides: SlideMainSide[] };
};

const DEFAULT: PortadaContent = {
  apartments: {
    slides: [
      { main: "/apto-main-4.jpg",      side: "/apto-side-1.jpg" },
      { main: "/apto-main-5.jpg",      side: "/apto-side-2.jpg" },
      { main: "/apto-main-6.jpg",      side: "/apto-side-4.jpg" },
    ],
  },
  houses: {
    slides: [
      { main: "/casa-1.jpg", preview: "/casa-4.jpg" },
      { main: "/casa-2.jpg", preview: "/casa-5.jpg" },
      { main: "/casa-3.jpg", preview: "/casa-6.jpg" },
    ],
  },
  terrain: {
    slides: [
      { main: "/apto-main-terreno1.jpg", side: "/apto-side-terreno1.jpg" },
      { main: "/apto-main-terreno2.jpg", side: "/apto-side-terreno2.jpg" },
      { main: "/apto-main-terreno3.jpg", side: "/apto-side-terreno3.jpg" },
    ],
  },
};

// ── helpers ────────────────────────────────────────────────────────────────────

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function Thumb({ src }: { src: string }) {
  if (!src) return <div className="w-24 h-16 rounded border bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">Sin imagen</div>;
  return (
    <img
      src={src}
      alt=""
      className="w-24 h-16 object-cover rounded border"
    />
  );
}

// ── sección genérica main+side ─────────────────────────────────────────────────

function SectionMainSide({
  title,
  slides,
  labelB,
  onChange,
}: {
  title: string;
  slides: SlideMainSide[];
  labelB: string;
  onChange: (slides: SlideMainSide[]) => void;
}) {
  function setField(i: number, field: keyof SlideMainSide, url: string) {
    const next = slides.map((s, idx) => idx === i ? { ...s, [field]: url } : s);
    onChange(next);
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-6 py-4 border-b">
        <p className="font-semibold text-sm">{title}</p>
      </div>
      <div className="divide-y">
        {slides.map((slide, i) => (
          <div key={i} className="p-4 flex items-start gap-6">

            {/* Orden */}
            <div className="flex flex-col gap-1 pt-1 shrink-0">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => onChange(move(slides, i, i - 1))}
                className="text-xs px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-30"
              >↑</button>
              <button
                type="button"
                disabled={i === slides.length - 1}
                onClick={() => onChange(move(slides, i, i + 1))}
                className="text-xs px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-30"
              >↓</button>
            </div>

            <div className="text-xs text-gray-400 pt-3 w-4 shrink-0">{i + 1}</div>

            {/* Imagen principal */}
            <div className="space-y-2 flex-1">
              <p className="text-xs font-medium text-gray-500">Imagen principal</p>
              <Thumb src={slide.main} />
              <div className="flex items-center gap-2">
                <ImageUploader text="Subir" onUploaded={(url) => setField(i, "main", url)} />
                <input
                  type="text"
                  value={slide.main}
                  onChange={(e) => setField(i, "main", e.target.value)}
                  placeholder="URL imagen principal"
                  className="flex-1 border rounded px-2 py-1.5 text-xs"
                />
              </div>
            </div>

            {/* Imagen lateral */}
            <div className="space-y-2 flex-1">
              <p className="text-xs font-medium text-gray-500">{labelB}</p>
              <Thumb src={slide.side} />
              <div className="flex items-center gap-2">
                <ImageUploader text="Subir" onUploaded={(url) => setField(i, "side", url)} />
                <input
                  type="text"
                  value={slide.side}
                  onChange={(e) => setField(i, "side", e.target.value)}
                  placeholder={`URL ${labelB.toLowerCase()}`}
                  className="flex-1 border rounded px-2 py-1.5 text-xs"
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// ── sección casas (main + preview) ────────────────────────────────────────────

function SectionHouses({
  slides,
  onChange,
}: {
  slides: SlideMainPreview[];
  onChange: (slides: SlideMainPreview[]) => void;
}) {
  function setField(i: number, field: keyof SlideMainPreview, url: string) {
    const next = slides.map((s, idx) => idx === i ? { ...s, [field]: url } : s);
    onChange(next);
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-6 py-4 border-b">
        <p className="font-semibold text-sm">Casas y Villas</p>
      </div>
      <div className="divide-y">
        {slides.map((slide, i) => (
          <div key={i} className="p-4 flex items-start gap-6">

            <div className="flex flex-col gap-1 pt-1 shrink-0">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => onChange(move(slides, i, i - 1))}
                className="text-xs px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-30"
              >↑</button>
              <button
                type="button"
                disabled={i === slides.length - 1}
                onClick={() => onChange(move(slides, i, i + 1))}
                className="text-xs px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-30"
              >↓</button>
            </div>

            <div className="text-xs text-gray-400 pt-3 w-4 shrink-0">{i + 1}</div>

            <div className="space-y-2 flex-1">
              <p className="text-xs font-medium text-gray-500">Imagen principal</p>
              <Thumb src={slide.main} />
              <div className="flex items-center gap-2">
                <ImageUploader text="Subir" onUploaded={(url) => setField(i, "main", url)} />
                <input
                  type="text"
                  value={slide.main}
                  onChange={(e) => setField(i, "main", e.target.value)}
                  placeholder="URL imagen principal"
                  className="flex-1 border rounded px-2 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <p className="text-xs font-medium text-gray-500">Imagen preview</p>
              <Thumb src={slide.preview} />
              <div className="flex items-center gap-2">
                <ImageUploader text="Subir" onUploaded={(url) => setField(i, "preview", url)} />
                <input
                  type="text"
                  value={slide.preview}
                  onChange={(e) => setField(i, "preview", e.target.value)}
                  placeholder="URL imagen preview"
                  className="flex-1 border rounded px-2 py-1.5 text-xs"
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// ── página principal ───────────────────────────────────────────────────────────

export default function AdminPortadaPage() {
  const [content, setContent] = useState<PortadaContent>(DEFAULT);
  const { saving, setSaving, message, setMessage } = useSaveFeedback();

  useEffect(() => {
    fetch("/api/content/portada")
      .then((r) => r.ok ? r.json() : null)
      .then((data: PortadaContent | null) => {
        if (data) setContent(data);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/content/portada", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: "Guardado correctamente." });
    } catch {
      setMessage({ type: "error", text: "Error al guardar." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/content" className="text-sm text-gray-400 hover:text-black transition-colors">
            ← Contenido
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold">Imágenes de portada</h1>
        </div>
        <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-black transition-colors">
          Ver inicio →
        </Link>
      </div>

      <p className="text-sm text-gray-500">
        Cada sección tiene 3 slides. Cada slide tiene dos imágenes: la principal (imagen grande central) y la lateral (imagen del ascensor derecho). Usa las flechas para reordenar.
      </p>

      {/* Apartamentos */}
      <SectionMainSide
        title="Apartamentos"
        labelB="Imagen lateral (ascensor)"
        slides={content.apartments.slides}
        onChange={(slides) => setContent((prev) => ({ ...prev, apartments: { slides } }))}
      />

      {/* Casas y Villas */}
      <SectionHouses
        slides={content.houses.slides}
        onChange={(slides) => setContent((prev) => ({ ...prev, houses: { slides } }))}
      />

      {/* Terrenos */}
      <SectionMainSide
        title="Terrenos / Naves Industriales"
        labelB="Imagen lateral (ascensor)"
        slides={content.terrain.slides}
        onChange={(slides) => setContent((prev) => ({ ...prev, terrain: { slides } }))}
      />

      {/* Guardar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-black/80 disabled:opacity-50 transition"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {message && (
          <span
            className={`text-sm px-3 py-1.5 rounded-md border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? "✓ " : "✕ "}{message.text}
          </span>
        )}
      </div>

    </div>
  );
}
