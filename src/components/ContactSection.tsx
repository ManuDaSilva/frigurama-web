"use client";

import { useEffect, useRef, useState } from "react";

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

export default function ContactSection() {
  const { ref, inView } = useInView(0.25);

  return (
    <section
      ref={ref}
      className="relative w-full bg-[var(--background)]"
    >
      <div className="mx-auto w-full max-w-[1920px] px-10">
        <div className="grid grid-cols-12 items-center gap-x-10 gap-y-10 py-24">
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
              {/* Cambia este src por tu imagen */}
              <img
                src="/images/contacto.jpg"
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
                  "text-[44px] leading-[1.05] tracking-[-0.02em] text-black/85",
                  "transition-all duration-700",
                  inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                ].join(" ")}
              >
                Mantente
                <br />
                <span className="text-black/55">en contacto</span>
              </h3>

              <div className="mt-10 space-y-1">
                {[
                  "Propósito que guía",
                  "Estrategia que ordena",
                  "Equipo que cumple",
                  "Espacios que impulsan tu crecimiento.",
                ].map((line, i) => (
                  <p
                    key={line}
                    className={[
                      "text-[40px] leading-[1.05] tracking-[-0.02em] text-black/55",
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

                <a
                  href="/contacto"
                  className="inline-flex items-center justify-center rounded-full bg-black px-10 py-3 text-[14px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.20)] transition hover:translate-y-[-1px] hover:bg-black/90"
                >
                  HAZ TU CONSULTA AQUÍ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
