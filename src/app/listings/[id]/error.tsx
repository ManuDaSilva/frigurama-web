"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-3">Ha ocurrido un error</h1>
      <p className="text-gray-600 mb-6">{error.message || "No se pudo cargar el inmueble."}</p>
      <button
        onClick={() => reset()}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Reintentar
      </button>
    </main>
  );
}
