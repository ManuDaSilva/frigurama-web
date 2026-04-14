"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const EMPTY = { title: "", location: "", year: "", status: "en_proceso" as ProjectStatus };

export default function AdminProyectosPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showNew,  setShowNew]  = useState(false);
  const [form,     setForm]     = useState({ ...EMPTY });
  const [creating, setCreating] = useState(false);

  async function load() {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:    form.title.trim(),
          location: form.location || null,
          year:     form.year ? Number(form.year) : null,
          status:   form.status,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      router.push(`/admin/content/proyectos/${created.id}`);
    } catch {
      setCreating(false);
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
          {!showNew && (
            <button
              onClick={() => { setShowNew(true); setForm({ ...EMPTY }); }}
              className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-black/80 transition"
            >
              + Nuevo proyecto
            </button>
          )}
        </div>
      </div>

      {/* Formulario nuevo */}
      {showNew && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Nuevo proyecto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Título *</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nombre del proyecto"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ubicación</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Barcelona, Madrid…"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Año</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
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
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleCreate}
              disabled={creating || !form.title.trim()}
              className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-black/80 disabled:opacity-50 transition"
            >
              {creating ? "Creando…" : "Crear y editar"}
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-black transition"
            >
              Cancelar
            </button>
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
                <Link
                  href={`/admin/content/proyectos/${p.id}`}
                  className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50 transition"
                >
                  Editar
                </Link>
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
