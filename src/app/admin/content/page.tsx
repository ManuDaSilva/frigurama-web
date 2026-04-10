import Link from "next/link";

export const metadata = { title: "Contenido — Admin Frigurama" };

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contenido del sitio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <Link
          href="/admin/content/portada"
          className="block p-6 bg-white border rounded-lg hover:border-black transition-colors group"
        >
          <p className="font-semibold text-sm group-hover:underline">Imágenes de portada</p>
          <p className="mt-1 text-xs text-gray-500">Gestionar imágenes de los sliders del inicio</p>
        </Link>

        <Link
          href="/admin/content/proyectos"
          className="block p-6 bg-white border rounded-lg hover:border-black transition-colors group"
        >
          <p className="font-semibold text-sm group-hover:underline">Proyectos</p>
          <p className="mt-1 text-xs text-gray-500">Editar la página pública /projects</p>
        </Link>

        <Link
          href="/admin/content/contacto"
          className="block p-6 bg-white border rounded-lg hover:border-black transition-colors group"
        >
          <p className="font-semibold text-sm group-hover:underline">Contacto</p>
          <p className="mt-1 text-xs text-gray-500">Editar la página pública /contact</p>
        </Link>

        <Link
          href="/admin/content/privacidad"
          className="block p-6 bg-white border rounded-lg hover:border-black transition-colors group"
        >
          <p className="font-semibold text-sm group-hover:underline">Política de Privacidad</p>
          <p className="mt-1 text-xs text-gray-500">Editar la página pública /privacy</p>
        </Link>
      </div>
    </div>
  );
}
