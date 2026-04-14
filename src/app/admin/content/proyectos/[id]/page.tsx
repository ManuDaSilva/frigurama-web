"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import SortableImageGrid from "@/components/SortableImageGrid";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg bg-white min-h-[200px] flex items-center justify-center text-sm text-gray-400">
      Cargando editor…
    </div>
  ),
});

type ProjectStatus = "en_proceso" | "terminado" | "proximamente";

type ProjectImage = { id: string; url: string };

type Project = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  location: string | null;
  year: number | null;
  status: ProjectStatus;
  published: boolean;
  images: ProjectImage[];
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  en_proceso:   "En proceso",
  terminado:    "Terminado",
  proximamente: "Próximamente",
};

export default function EditProyectoPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* form fields */
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [location,    setLocation]    = useState("");
  const [year,        setYear]        = useState("");
  const [status,      setStatus]      = useState<ProjectStatus>("en_proceso");
  const [published,   setPublished]   = useState(true);
  const [coverUrl,    setCoverUrl]    = useState("");
  const [images,      setImages]      = useState<ProjectImage[]>([]);

  async function load() {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) { router.push("/admin/content/proyectos"); return; }
    const data: Project = await res.json();
    setProject(data);
    setTitle(data.title);
    setDescription(data.description ?? "");
    setLocation(data.location ?? "");
    setYear(data.year ? String(data.year) : "");
    setStatus(data.status);
    setPublished(data.published);
    setCoverUrl(data.coverUrl ?? "");
    setImages(data.images);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description: description || null,
          location: location || null,
          year: year ? Number(year) : null,
          status, published, coverUrl: coverUrl || null,
        }),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: "Guardado correctamente." });
    } catch {
      setMessage({ type: "error", text: "Error al guardar." });
    } finally {
      setSaving(false);
    }
  }

  async function addImage(url: string) {
    const res = await fetch(`/api/projects/${id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      const img: ProjectImage = await res.json();
      setImages((prev) => [...prev, img]);
      if (!coverUrl) setCoverUrl(url);
    }
  }

  async function removeImage(img: ProjectImage) {
    await fetch(`/api/projects/${id}/images/${img.id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    if (coverUrl === img.url) {
      const next = images.find((i) => i.id !== img.id);
      setCoverUrl(next?.url ?? "");
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Cargando…</p>;
  if (!project) return null;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/content/proyectos" className="text-sm text-gray-400 hover:text-black transition-colors">
            ← Proyectos
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold truncate max-w-xs">{project.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        {/* Columna principal */}
        <div className="space-y-6">

          {/* Datos */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 border-b pb-2">
              Información
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Título *</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ubicación</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Barcelona, Madrid…"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Año</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Estado</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                >
                  <option value="en_proceso">En proceso</option>
                  <option value="terminado">Terminado</option>
                  <option value="proximamente">Próximamente</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Descripción</label>
                {!loading && (
                  <RichTextEditor
                    compact
                    content={description}
                    onChange={setDescription}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 border-b pb-2">
              Fotos
            </h2>

            <SortableImageGrid
              images={images}
              coverUrl={coverUrl}
              onReorder={(reordered) => {
                setImages(reordered);
                if (!coverUrl) setCoverUrl(reordered[0]?.url ?? "");
              }}
              onRemove={removeImage}
              onSetCover={setCoverUrl}
            />

            <div>
              <p className="text-sm text-gray-500 mb-2">Añadir fotos</p>
              <ImageUploader onUploaded={addImage} />
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20">

          {/* Publicado */}
          <button
            type="button"
            onClick={() => setPublished((v) => !v)}
            className={`w-full rounded-xl border-2 p-4 text-left transition ${
              published
                ? "bg-green-50 border-green-400"
                : "bg-gray-50 border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className={`font-semibold text-sm ${published ? "text-green-800" : "text-gray-600"}`}>
              {published ? "Publicado" : "No publicado"}
            </div>
            <div className={`text-xs mt-0.5 ${published ? "text-green-600" : "text-gray-400"}`}>
              {published ? "Visible en la página de proyectos" : "No aparece en la web"}
            </div>
          </button>

          {/* Guardar */}
          <div className="bg-white border rounded-xl p-4 space-y-2">
            {message && (
              <p className={`text-xs px-3 py-2 rounded border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                {message.type === "success" ? "✓ " : "✕ "}{message.text}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            <Link
              href="/admin/content/proyectos"
              className="block w-full py-2 rounded-lg text-sm text-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-gray-200 transition"
            >
              Volver a proyectos
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
