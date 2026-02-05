"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import React from "react";


const THUMB_H = 360; // ajusta si quieres más/menos grande
const GAP = 32;      // “aire” premium entre slides


type Slide = {
  id: number;
  main: string;
  side: string;
  caption: string;
};

const slides: Slide[] = [
  {
    id: 1,
    main: "/apto-main-1.jpg",   // pon tus rutas reales
    side: "/apto-side-1.jpg",
    caption:
      "Proyectos pensados para disfrutar la vida en la ciudad, con comodidades y elegancia en equilibrio, con áreas.",
  },
  {
    id: 2,
    main: "/apto-main-2.jpg",
    side: "/apto-side-2.jpg",
    caption:
      "Proyectos pensados para disfrutar la vida en la ciudad, con comodidades y elegancia en equilibrio, con áreas.",
  },
  {
    id: 3,
    main: "/apto-main-3.jpg",
    side: "/apto-side-3.jpg",
    caption:
      "Proyectos pensados para disfrutar la vida en la ciudad, con comodidades y elegancia en equilibrio, con áreas.",
  },
];

export default function TerrainSlider() {
  const [current, setCurrent] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sincroniza la imagen grande con el scroll de la columna derecha
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    let raf = 0;

    const updateFromScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rootRect = root.getBoundingClientRect();
        const rootCenter = rootRect.top + rootRect.height / 2;

        let bestIndex = 0;
        let bestDist = Infinity;

        itemRefs.current.forEach((el, idx) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const c = r.top + r.height / 2;
          const d = Math.abs(c - rootCenter);
          if (d < bestDist) {
            bestDist = d;
            bestIndex = idx;
          }
        });

        setCurrent(bestIndex);
      });
    };

    root.addEventListener("scroll", updateFromScroll, { passive: true });

    // Inicializa al montar
    updateFromScroll();

    return () => {
      root.removeEventListener("scroll", updateFromScroll);
      cancelAnimationFrame(raf);
    };
  }, []);




  const active = slides[current];

  const goTo = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    // setCurrent(index); // opcional: puedes quitarlo
  };

return (
  <div className="grid grid-cols-[760px_320px] gap-x-16 items-start">
    {/* IMAGEN GRANDE (760x760) */}
    <div
      className="
        relative
        aspect-square
        w-[760px]
        overflow-hidden
        rounded-[28px]
        shadow-[0_30px_80px_rgba(0,0,0,0.22)]
        bg-[#e7ecec]
      "
    >
      <Image
        src={active.main}
        alt="Imagen principal"
        fill
        sizes="760px"
        className="object-cover"
        priority
      />
    </div>

    {/* DERECHA (SLIDER + TEXTO) */}
    <div className="flex flex-col items-stretch justify-center h-full">
      {/* SOLO la miniatura visible (con recorte) */}
      <div className="rounded-[24px] overflow-hidden">
        <div
          ref={listRef}
          className="overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-contain hide-scrollbar"
          style={{ height: `${THUMB_H}px` }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${GAP}px`,
              paddingBottom: `${GAP}px`,
            }}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onClick={() => goTo(index)}
                className={`
                  relative w-full snap-start overflow-hidden
                  transition-all duration-300
                  ${index === current ? "opacity-100" : "opacity-55"}
                `}
                style={{ height: `${THUMB_H}px` }}
              >
                <Image src={slide.side} alt="Imagen lateral" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TEXTO + NÚMERO */}
      <div className="mt-10 text-center text-[11px] tracking-[0.18em] uppercase">
        <p className="mb-3 max-w-xs mx-auto">{active.caption}</p>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black text-[10px]">
          {String(current + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  </div>
);


}
