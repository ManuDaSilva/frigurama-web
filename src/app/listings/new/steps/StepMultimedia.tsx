"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader"; // Asegúrate de que existe este componente

type Props = {
  urls: string[];
  coverUrl?: string;
  onChange: (urls: string[]) => void;
  onSetCover: (url: string) => void;
  onBack?: () => void; // opcional: si quieres botones internos de navegación
  onNext?: () => void; // opcional
};

export default function StepMultimedia({
  urls,
  coverUrl,
  onChange,
  onSetCover,
  onBack,
  onNext,
}: Props) {
  const [urlInput, setUrlInput] = useState("");

  function addUrl(raw: string) {
    const u = raw.trim();
    if (!u) return;

    // evita duplicados
    const next = Array.from(new Set([...urls, u]));
    onChange(next);

    // si no hay portada aún, usa esta
    if (!coverUrl) onSetCover(next[0] ?? "");
    setUrlInput("");
  }

  function removeUrl(u: string) {
    const next = urls.filter((x) => x !== u);
    onChange(next);

    // si quitamos la portada, reasignamos
    if (coverUrl === u) onSetCover(next[0] ?? "");
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Multimedia</h2>
      <p className="text-sm text-gray-600">
        Sube imágenes con Cloudinary o pega una URL manualmente.
      </p>

      {/* Uploader de Cloudinary (debes tener el componente listo) */}
      <ImageUploader onUploaded={(u: string) => addUrl(u)} />

      {/* Campo para añadir URL manual */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="https://…"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <button
          type="button"
          onClick={() => addUrl(urlInput)}
          className="px-3 py-2 rounded border hover:bg-gray-100"
        >
          Añadir
        </button>
      </div>

      {/* Selector de portada */}
      {urls.length > 0 && (
        <div>
          <label className="block text-sm mb-1">Portada</label>
          <select
            className="border rounded px-3 py-2"
            value={coverUrl ?? urls[0]}
            onChange={(e) => onSetCover(e.target.value)}
          >
            {urls.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grid de imágenes */}
      {urls.length > 0 && (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {urls.map((u) => (
            <li key={u} className="border rounded p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="w-full h-36 object-cover rounded" />
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => removeUrl(u)}
                >
                  Quitar
                </button>
                {coverUrl === u && (
                  <span className="text-xs px-2 py-0.5 rounded border">Portada</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Navegación opcional del paso */}
      {(onBack || onNext) && (
        <div className="flex justify-between pt-2">
          <button type="button" className="px-4 py-2 rounded border" onClick={onBack}>
            ← Atrás
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-black text-white"
            onClick={onNext}
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
}
