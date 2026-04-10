"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ProjectStatus = "en_proceso" | "terminado" | "proximamente";

type Project = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  location: string | null;
  year: number | null;
  status: ProjectStatus;
  published: boolean;
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  en_proceso:   "En proceso",
  terminado:    "Terminado",
  proximamente: "Próximamente",
};

const EMPTY: Omit<Project, "id"> = {
  title: "",
  description: "",
  coverUrl: "",
  location: "",
  year: null,
  status: "en_proceso",
  published: true,
};

export default function AdminProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState<Omit<Project, "id"> | null>(null);
  const [editId, setEditId]     = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function load() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY });
    setMessage(null);
  }

  function openEdit(p: Project) {
    setEditId(p.id);
    setForm({
      title:       p.title,
      description: p.description ?? "",
      coverUrl:    p.coverUrl    ?? "",
      location:    p.location    ?? "",
      year:        p.year,
      status:      p.status,
      published:   p.published,
    });
    setMessage(null);
  }

  function cancel() {
    setForm(null);
    setEditId(null);
    setMessage(null);
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    try {
      const url    = editId ? `/api/projects/${editId}` : "/api/projects";
      const method = editId ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: form.year ? Number(form.year) : null,
        }),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: "Guardado correctamente." });
      cancel();
      load();
    } catch {
      setMessage({ type: "error", text: "Error al guardar." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/content" className="text-sm text-gray-400 hover:text-black transition-colors">
            ← Contenido
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold">Proyectos</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/projects" target="_blank" className="text-xs text-gray-400 hover:text-black transition-colors">
            Ver página →
          </Link>
          {!form && (
            <button
              onClick={openNew}
              className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-black/80 transition"
            >
              + Nuevo proyecto
            </button>
          )}
        </div>
      </div>

      {/* Formulario */}
      {form && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">{editId ? "Editar proyecto" : "Nuevo proyecto"}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Título *</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nombre del proyecto"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Ubicación</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Barcelona, Madrid…"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Año</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.year ?? ""}
                onChange={(e) => setForm({ ...form, year: e.target.value ? Number(e.target.value) : null })}
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
              >
                <option value="en_proceso">En proceso</option>
                <option value="terminado">Terminado</option>
                <option value="proximamente">Próximamente</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm text-gray-600">Publicado</label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">URL de imagen</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.coverUrl ?? ""}
                onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                placeholder="https://..."
              />
              {form.coverUrl && (
                <div className="mt-2 relative w-40 h-28 rounded overflow-hidden border">
                  <Image src={form.coverUrl} alt="preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Descripción</label>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm min-h-[100px]"
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descripción del proyecto…"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-black/80 disabled:opacity-50 transition"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={cancel}
              className="px-4 py-2 text-sm text-gray-500 hover:text-black transition"
            >
              Cancelar
            </button>
            {message && (
              <span className={`text-sm px-3 py-1.5 rounded-md border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                {message.type === "success" ? "✓ " : "✕ "}{message.text}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-gray-400">Cargando…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-gray-400 py-12 text-center">No hay proyectos todavía.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-4 bg-white border rounded-xl px-5 py-4">
              {p.coverUrl && (
                <div className="relative w-16 h-12 rounded overflow-hidden shrink-0 border">
                  <Image src={p.coverUrl} alt={p.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {STATUS_LABEL[p.status]}
                  {p.location ? ` · ${p.location}` : ""}
                  {p.year ? ` · ${p.year}` : ""}
                  {!p.published ? " · Oculto" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50 transition"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
