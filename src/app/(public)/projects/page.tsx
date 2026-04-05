import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos inmobiliarios de Frigurama: desarrollos residenciales, comerciales y de uso mixto con metodología propia.",
};

type ProyectosContent = { body: string };

const DEFAULT_BODY = "<h1>Proyectos</h1><p>Próximamente.</p>";

export default async function ProjectsPage() {
  const row = await prisma.siteContent.findUnique({ where: { section: "proyectos" } });
  const content = (row?.content as ProyectosContent) ?? { body: DEFAULT_BODY };
  const body = content.body || DEFAULT_BODY;

  return (
    <main className="w-full bg-[var(--background)] text-black font-sans pt-[81px]">
      <div className="mx-auto w-full max-w-[800px] px-6 py-20">
        <div
          className="
            [&_h1]:text-[52px] [&_h1]:font-bold [&_h1]:leading-[1.05] [&_h1]:tracking-[-0.02em] [&_h1]:text-black/85 [&_h1]:mt-0 [&_h1]:mb-6
            [&_h2]:text-[32px] [&_h2]:font-semibold [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.01em] [&_h2]:text-black/80 [&_h2]:mt-12 [&_h2]:mb-4
            [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:text-black/75 [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-black/65 [&_p]:mb-5
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-1
            [&_li]:text-[17px] [&_li]:leading-[1.75] [&_li]:text-black/65
            [&_a]:text-black/80 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-black hover:[&_a]:transition-colors
            [&_img]:rounded-[20px] [&_img]:w-full [&_img]:my-10 [&_img]:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
            [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-black/10 [&_hr]:my-12
            [&_strong]:font-semibold [&_strong]:text-black/80
            [&_em]:italic
          "
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </main>
  );
}
