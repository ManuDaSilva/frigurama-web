"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSaveFeedback } from "@/hooks/useSaveFeedback";
import dynamic from "next/dynamic";

// SSR=false porque Tiptap depende del DOM
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg bg-white min-h-[480px] flex items-center justify-center text-sm text-gray-400">
      Cargando editor…
    </div>
  ),
});

type ProyectosContent = { body: string };

const DEFAULT_BODY = "<h1>Proyectos</h1><p>Escribe el contenido aquí.</p>";

export default function AdminProyectosPage() {
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loaded, setLoaded] = useState(false);
  const { saving, setSaving, message, setMessage } = useSaveFeedback();

  useEffect(() => {
    fetch("/api/content/proyectos")
      .then((r) => r.json())
      .then((data: ProyectosContent) => {
        setBody(data.body || DEFAULT_BODY);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/content/proyectos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
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
          <Link
            href="/admin/content"
            className="text-sm text-gray-400 hover:text-black transition-colors"
          >
            ← Contenido
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold">Proyectos</h1>
        </div>
        <Link
          href="/projects"
          target="_blank"
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Ver página →
        </Link>
      </div>

      {loaded && <RichTextEditor content={body} onChange={setBody} />}

      <div className="flex items-center gap-4 pb-8">
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
