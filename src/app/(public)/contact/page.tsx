import ContactSection, { type ContactContent } from "@/components/ContactSection";
import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con Frigurama para consultas sobre compra, venta o alquiler de inmuebles. Teléfono, email y dirección en Barcelona.",
};

const DEFAULT_CONTACT: ContactContent = {
  heading: "Mantente\nen contacto",
  lines: [
    "Propósito que guía",
    "Estrategia que ordena",
    "Equipo que cumple",
    "Espacios que impulsan tu crecimiento.",
  ],
  image: "/contacto.jpg",
  ctaText: "HAZ TU CONSULTA AQUÍ",
  phone: "934763494",
  email: "info@frigurama.com",
  address: "C/ de Muntaner, 200, 3º4ª, Eixample, 08036 Barcelona",
};

export default async function ContactPage() {
  const row = await prisma.siteContent.findUnique({ where: { section: "contacto" } });
  const content: ContactContent = (row?.content as ContactContent) ?? DEFAULT_CONTACT;

  return (
    <main className="w-full min-h-screen bg-[#e7ecec] text-black font-sans pt-[81px]">
      <ContactSection content={content} />

      {/* Contact details */}
      {(content.phone || content.email || content.address) && (
        <section className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-black/10 pt-12">
            {content.phone && (
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-2">
                  Teléfono
                </p>
                <p className="text-[18px] text-black/85">{content.phone}</p>
              </div>
            )}
            {content.email && (
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-2">
                  Email
                </p>
                <p className="text-[18px] text-black/85">{content.email}</p>
              </div>
            )}
            {content.address && (
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-2">
                  Dirección
                </p>
                <p className="text-[18px] text-black/85">{content.address}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
