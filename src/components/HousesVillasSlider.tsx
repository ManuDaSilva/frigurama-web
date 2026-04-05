"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type Slide = {
  id: number;
  main: string;
  preview?: string;
  label?: string;
  caption?: string;
};

const slides: Slide[] = [
  {
    id: 1,
    main: "/casa-1.png",
    preview: "/casa-1.png",
    label: "Maison Crivela",
    caption:
      "PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y ELEGANCIA EN EQUILIBRIO, CON ÁREAS",
  },
  {
    id: 2,
    main: "/casa-1.png",
    preview: "/casa-1.png",
    label: "Maison Crivela",
    caption:
      "PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y ELEGANCIA EN EQUILIBRIO, CON ÁREAS",
  },
  {
    id: 3,
    main: "/casa-1.png",
    preview: "/casa-1.png",
    label: "Maison Crivela",
    caption:
      "PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y ELEGANCIA EN EQUILIBRIO, CON ÁREAS",
  },
];

type Props = {
  className?: string;
};

export default function HousesVillasSlider({ className = "" }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const MAIN_W = 780;
  const MAIN_H = 720;
  const GAP = 48; // prueba 20, 24 o 28
  const STEP = MAIN_W + GAP;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const i = Math.round(el.scrollLeft / STEP);
      setActive(Math.max(0, Math.min(slides.length - 1, i)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const current = slides[active];

  return (
    <div className={`group relative w-[1580px] ${className}`}>
      <div className="grid grid-cols-[700px_780px] items-end gap-16">
        {/* ZONA IZQUIERDA: preview + caption */}
        <div className="relative left-[-430px] top-[-20px] flex h-[430px] items-end">
          <div className="flex items-center gap-12 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="relative h-[400px] w-[420px] shrink-0 overflow-hidden rounded-[28px] bg-[#e7ecec]">
              <Image
                src={current.preview || current.main}
                alt={current.label || "Preview Casa / Villa"}
                fill
                className="object-cover object-center"
                sizes="420px"
              />
            </div>

            <div className="ml-18 flex h-[400px] w-[320px] shrink-0 flex-col justify-center text-center">
              {current.label ? (
                <div className="mb-12 text-[22px] leading-none text-black/80">
                  {current.label}
                </div>
              ) : null}

              {current.caption ? (
                <p className="text-[22px] leading-[0.98] uppercase tracking-[-0.03em] text-black/90">
                  {current.caption}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* ZONA DERECHA: imagen principal */}
          <div className="relative left-[-210px] w-[780px] shrink-0">
            <div
              ref={scrollerRef}
              className="w-[780px] overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
              style={{ scrollBehavior: "smooth" }}
            >
            <div className="flex gap-12">
              {slides.map((s) => (
                <div key={s.id} className="snap-start shrink-0">
                  <div className="relative h-[720px] w-[780px] overflow-hidden rounded-[30px] bg-[#e7ecec]">
                    <Image
                      src={s.main}
                      alt="Casa / Villa"
                      fill
                      className="object-cover object-center"
                      sizes="660px"
                      priority={s.id === 1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}