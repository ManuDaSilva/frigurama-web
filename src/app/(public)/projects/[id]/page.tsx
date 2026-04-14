import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectGallery from "./ProjectGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return {};
  return {
    title: `${project.title} — Frigurama`,
    description: project.description ?? undefined,
  };
}

export default async function ProjectDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id, published: true },
    include: { images: { orderBy: { createdAt: "asc" } } },
  });

  if (!project) notFound();

  const STATUS_LABEL: Record<string, string> = {
    en_proceso:   "En proceso",
    terminado:    "Terminado",
    proximamente: "Próximamente",
  };

  const allImages = [
    ...(project.coverUrl ? [project.coverUrl] : []),
    ...project.images.map((i) => i.url).filter((u) => u !== project.coverUrl),
  ];

  return (
    <div className="bg-[#e7ecec] min-h-screen">

      {/* Galería */}
      <ProjectGallery images={allImages} title={project.title} />

      {/* Info */}
      <div className="px-6 lg:px-12 py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[11px] tracking-[0.2em] uppercase">
            {STATUS_LABEL[project.status] ?? project.status}
          </span>
          {(project.location || project.year) && (
            <span className="text-xs tracking-[0.15em] uppercase text-gray-400">
              {[project.location, project.year?.toString()].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
        <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-6 font-editorial">
          {project.title}
        </h1>
        {project.description && (
          <div
            className="prose prose-sm text-gray-600 max-w-lg"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        )}
      </div>

    </div>
  );
}
