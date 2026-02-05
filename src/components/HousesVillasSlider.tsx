"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type Slide = {
  id: number;
  main: string;
};

const slides: Slide[] = [
  { id: 1, main: "/casa-1.png" },
  { id: 2, main: "/casa-1.png" },
  { id: 3, main: "/casa-1.png" },
];

type Props = {
  className?: string;
};

export default function HousesVillasSlider({ className = "" }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // Medidas (cuadrado perfecto)
  const CARD = 760; // ancho/alto del cuadrado

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      // calcula el índice en base al ancho del card
      const i = Math.round(el.scrollLeft / CARD);
      setActive(Math.max(0, Math.min(slides.length - 1, i)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`w-[760px] ${className}`}>
      {/* SCROLLER horizontal (barra visible) */}
      <div
        ref={scrollerRef}
        className="w-[760px] overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex">
          {slides.map((s) => (
            <div key={s.id} className="snap-start">
              {/* Card cuadrada */}
              <div className="relative w-[760px] h-[760px] rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)] bg-[#e7ecec]">
                <Image
                  src={s.main}
                  alt="Casa / Villa"
                  fill
                  // IMPORTANTE:
                  // - object-contain = no se corta NADA (lo que me pediste: que no se vea cortado)
                  // - si prefieres más “impacto” aunque recorte un pelín, cámbialo a object-cover
                  className="object-contain"
                  sizes="760px"
                  priority={s.id === 1}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicador tipo “3 of 6” opcional (por si lo quieres) */}
      <div className="mt-3 text-center text-xs tracking-widest text-black/50">
        {active + 1} of {slides.length}
      </div>
    </div>
  );
}
