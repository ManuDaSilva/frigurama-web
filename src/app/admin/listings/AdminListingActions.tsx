"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ListingStatus } from "@prisma/client";

const STATUS_LABELS: Record<ListingStatus, string> = {
  activo:    "Activo",
  oculto:    "Oculto",
  vendido:   "Vendido",
  alquilado: "Alquilado",
};

export default function AdminListingActions({
  id,
  status,
  published,
  title,
  isPublic,
}: {
  id: string;
  status: ListingStatus;
  published: boolean;
  title: string | null;
  isPublic: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy]         = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  function refreshWithDelay() {
    setSucceeded(true);
    setTimeout(() => { router.refresh(); }, 900);
  }

  async function handlePublishedToggle() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ published: !published }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Error al actualizar la visibilidad.");
      }
      refreshWithDelay();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusChange(newStatus: ListingStatus) {
    if (newStatus === status) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Error al actualizar el estado.");
      }
      refreshWithDelay();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    const displayName = title?.trim() || "este inmueble";
    const confirmed = window.confirm(
      `¿Eliminar "${displayName}"?\n\n` +
      `Esta acción es irreversible y borrará el inmueble y todas sus imágenes permanentemente.\n\n` +
      `Si solo quieres ocultarlo del catálogo público, usa el estado "Oculto" en lugar de eliminar.`
    );
    if (!confirmed) return;

    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${id}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Error al eliminar el inmueble.");
      }
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {/* Status changer */}
        <select
          value={status}
          disabled={busy}
          onChange={(e) => handleStatusChange(e.target.value as ListingStatus)}
          className="text-xs border rounded px-2 py-1 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(Object.keys(STATUS_LABELS) as ListingStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {/* Visibility toggle */}
        <button
          type="button"
          disabled={busy || succeeded}
          onClick={handlePublishedToggle}
          className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            succeeded
              ? "border-green-300 text-green-700 bg-green-50"
              : published
              ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              : "border-orange-300 text-orange-600 hover:bg-orange-50"
          }`}
        >
          {succeeded ? "✓" : published ? "Visible" : "Oculto"}
        </button>

        {/* Public view link — only for active listings */}
        {isPublic && (
          <a
            href={`/listings/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
          >
            Ver ↗
          </a>
        )}

        {/* Edit link */}
        <a
          href={`/admin/listings/${id}/edit`}
          className="text-xs text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
        >
          Editar
        </a>

        {/* Delete */}
        <button
          type="button"
          disabled={busy}
          onClick={handleDelete}
          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Eliminar
        </button>
      </div>

      {/* Inline error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 max-w-[260px] text-right">
          {error}
        </p>
      )}
    </div>
  );
}
