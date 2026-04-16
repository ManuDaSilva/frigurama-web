import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos — Frigurama",
  description:
    "Proyectos inmobiliarios de Frigurama: desarrollos residenciales, comerciales y de uso mixto con metodología propia.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#e7ecec]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 lg:pl-8 lg:pr-12 pt-16 pb-14">
        <p className="text-[10px] tracking-[0.38em] uppercase text-gray-400 mb-5">(02)</p>
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] items-end gap-8 lg:gap-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-[9rem] font-light tracking-tight text-gray-900 leading-none">
            Proyectos
          </h1>
          <div className="lg:pb-2 space-y-4 lg:border-l lg:border-gray-300 lg:pl-8">
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Desarrollos residenciales, comerciales y de uso mixto con metodología propia.
            </p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400">
              {projects.length === 1
                ? "1 proyecto"
                : `${projects.length} proyectos`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 pb-40">
        {projects.length === 0 ? (
          <p className="text-sm text-gray-400 py-24 text-center tracking-wide">
            Próximamente.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
