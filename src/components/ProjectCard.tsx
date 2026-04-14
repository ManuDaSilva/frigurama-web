import Image from "next/image";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  location: string | null;
  year: number | null;
  status: string;
};

const STATUS_LABEL: Record<string, string> = {
  en_proceso:    "En proceso",
  terminado:     "Terminado",
  proximamente:  "Próximamente",
};

export default function ProjectCard({ p }: { p: Project }) {
  const statusLabel = STATUS_LABEL[p.status] ?? p.status;

  const subtitle = [p.location, p.year?.toString()]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="group rounded-xl overflow-hidden border border-gray-200 bg-[#e8ebe8] hover:shadow-sm transition-shadow duration-300">
      <Link href={`/projects/${p.id}`} className="block">

      {/* Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-[1/1] overflow-hidden">
        {p.coverUrl ? (
          <Image
            src={p.coverUrl}
            alt={p.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-3xl font-light tracking-[0.3em] uppercase text-gray-300">
              Proyecto
            </span>
          </div>
        )}
      </div>

      {/* Bottom band */}
      <div className="flex items-center gap-6 px-6 py-7">

        {/* Left — status badge */}
        <span className="shrink-0 px-4 py-2 bg-gray-900 text-white rounded-xl text-[11px] tracking-[0.2em] uppercase hover:bg-[#FF8614] transition-colors duration-200">
          {statusLabel}
        </span>

        {/* Center — title + subtitle */}
        <div className="flex-1 min-w-0 text-center">
          <p className="text-gray-900 font-normal text-base leading-snug truncate font-editorial">
            {p.title}
          </p>
          {subtitle && (
            <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right — description preview */}
        {p.description && (
          <div className="shrink-0 text-right max-w-[140px]">
            <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">
              {p.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}
            </p>
          </div>
        )}

      </div>
      </Link>
    </li>
  );
}
