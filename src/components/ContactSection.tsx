"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export type ContactContent = {
  heading: string;
  lines: string[];
  image: string;
  ctaText: string;
  phone: string;
  email: string;
  address: string;
};

const DEFAULT_CONTENT: ContactContent = {
  heading: "Mantente\nen contacto",
  lines: [
    "Propósito que guía",
    "Estrategia que ordena",
    "Equipo que cumple",
    "Espacios que impulsan tu crecimiento.",
  ],
  image: "/contacto-2.jpg",
  ctaText: "HAZ TU CONSULTA AQUÍ",
  phone: "934763494",
  email: "info@frigurama.com",
  address: "08036. Muntaner, 0200",
};

export default function ContactSection({ content = DEFAULT_CONTENT }: { content?: ContactContent }) {
  const { ref, inView } = useInView(0.25);
  const pathname = usePathname();
  const parts = content.heading.split("\n");

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#e7ecec]"
    >
      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10">
        <div className="grid grid-cols-12 items-center gap-x-0 lg:gap-x-10 gap-y-8 lg:gap-y-10 py-12 lg:py-24">
          {/* Imagen izquierda */}
          <div className="col-span-12 md:col-span-4">
            <div
              className={[
                "aspect-square w-full overflow-hidden rounded-[38px] bg-black/5",
                "shadow-[0_20px_70px_rgba(0,0,0,0.10)]",
                "transition-all duration-700",
                inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              ].join(" ")}
            >
              <img
                src={content.image || "/contacto.jpg"}
                alt="Rigūrama"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Texto + CTA derecha */}
          <div className="col-span-12 md:col-span-8">
            <div className="relative">
              <h3
                className={[
                  "text-[30px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] text-black/85",
                  "transition-all duration-700",
                  inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                ].join(" ")}
              >
                {parts[0]}
                {parts[1] !== undefined && (
                  <>
                    <br />
                    <span className="text-black/55">{parts[1]}</span>
                  </>
                )}
              </h3>

              <div className="mt-10 space-y-1">
                {content.lines.map((line, i) => (
                  <p
                    key={i}
                    className={[
                      "text-[26px] sm:text-[40px] leading-[1.05] tracking-[-0.02em] text-black/55",
                      "transition-all duration-700 will-change-transform",
                      inView
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0",
                    ].join(" ")}
                    style={{ transitionDelay: `${120 + i * 90}ms` }}
                  >
                    <span className={i === 0 ? "text-black/85" : ""}>{line}</span>
                  </p>
                ))}
              </div>

              <div
                className={[
                  "mt-14 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10",
                  "transition-all duration-700",
                  inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                ].join(" ")}
                style={{ transitionDelay: "520ms" }}
              >
                <div className="text-[18px] leading-none text-black/85">
                  FRIGURAMA
                  <br />
                  <span className="text-black/60">©2026</span>
                </div>

                {pathname !== "/contact" && (
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-black px-10 py-3 text-[14px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.20)] transition hover:translate-y-[-1px] hover:bg-black/90"
                  >
                    {content.ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
