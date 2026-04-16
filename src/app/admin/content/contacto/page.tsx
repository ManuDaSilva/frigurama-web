"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import { useSaveFeedback } from "@/hooks/useSaveFeedback";

type ContactContent = {
  heading: string;
  lines: string[];
  image: string;
  ctaText: string;
  phone: string;
  email: string;
  address: string;
};

const DEFAULT: ContactContent = {
  heading: "Mantente\nen contacto",
  lines: [
    "Propósito que guía",
    "Estrategia que ordena",
    "Equipo que cumple",
    "Espacios que impulsan tu crecimiento.",
  ],
  image: "/contacto.jpg",
  ctaText: "HAZ TU CONSULTA AQUÍ",
  phone: "934763494",
  email: "info@frigurama.com",
  address: "08036. Muntaner, 200",
};

export default function AdminContactoPage() {
  const [content, setContent] = useState<ContactContent>(DEFAULT);
  const [linesText, setLinesText] = useState(DEFAULT.lines.join("\n"));
  const { saving, setSaving, message, setMessage } = useSaveFeedback();

  useEffect(() => {
    fetch("/api/content/contacto")
      .then((r) => r.json())
      .then((data: ContactContent) => {
        setContent(data);
        setLinesText((data.lines ?? []).join("\n"));
      })
      .catch(() => {});
  }, []);

  function set<K extends keyof ContactContent>(key: K, value: ContactContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const payload: ContactContent = {
      ...content,
      lines: linesText.split("\n").map((l) => l.trim()).filter(Boolean),
    };
    try {
      const res = await fetch("/api/content/contacto", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/content" className="text-sm text-gray-400 hover:text-black transition-colors">
            ← Contenido
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold">Contacto</h1>
        </div>
        <Link
          href="/contact"
          target="_blank"
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Ver página →
        </Link>
      </div>

      <div className="bg-white rounded-lg border divide-y">

        {/* Imagen */}
        <div className="p-6 space-y-3">
          <label className="text-sm font-medium text-gray-700 block">Imagen</label>
          {content.image && (
            <img
              src={content.image}
              alt=""
              className="w-32 h-32 object-cover rounded-lg border"
            />
          )}
          <div className="flex items-center gap-3">
            <ImageUploader
              text="Subir imagen"
              onUploaded={(url) => set("image", url)}
            />
            <input
              type="text"
              value={content.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="URL de imagen"
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Título */}
        <div className="p-6 space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Título{" "}
            <span className="font-normal text-gray-400">(usa una línea nueva para dividir en dos partes)</span>
          </label>
          <textarea
            value={content.heading}
            onChange={(e) => set("heading", e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2 text-sm font-mono"
          />
        </div>

        {/* Líneas de texto */}
        <div className="p-6 space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Líneas de texto{" "}
            <span className="font-normal text-gray-400">(una por línea)</span>
          </label>
          <textarea
            value={linesText}
            onChange={(e) => setLinesText(e.target.value)}
            rows={5}
            className="w-full border rounded px-3 py-2 text-sm font-mono"
          />
        </div>

        {/* Botón CTA */}
        <div className="p-6 space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Texto del botón</label>
          <input
            type="text"
            value={content.ctaText}
            onChange={(e) => set("ctaText", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Datos de contacto */}
        <div className="p-6 space-y-3">
          <p className="text-sm font-medium text-gray-700">Datos de contacto</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Teléfono</label>
              <input
                type="text"
                value={content.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Email</label>
              <input
                type="text"
                value={content.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Dirección</label>
              <input
                type="text"
                value={content.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-black/80 disabled:opacity-50 transition"
        >
          {saving ? "Guardando..." : "Guardar"}
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
