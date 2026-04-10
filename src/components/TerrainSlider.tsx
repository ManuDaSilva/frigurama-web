"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const THUMB_H = 575;
const IMG_H   = 455;
const BLOCK_H = 660; // IMG_H + mt-10 + texto + contador

type Slide = {
  id: number;
  main: string;
  side: string;
  caption: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    main: "/apto-main-terreno1.jpg",
    side: "/apto-side-terreno1.jpg",
    caption:
      "Proyectos pensados para disfrutar la vida en la ciudad, con comodidades y elegancia en equilibrio, con áreas.",
  },
  {
    id: 2,
    main: "/apto-main-terreno2.jpg",
    side: "/apto-side-terreno2.jpg",
    caption:
      "Proyectos pensados para disfrutar la vida en la ciudad, con comodidades y elegancia en equilibrio, con áreas.",
  },
  {
    id: 3,
    main: "/apto-main-terreno3.jpg",
    side: "/apto-side-terreno3.jpg",
    caption:
      "Proyectos pensados para disfrutar la vida en la ciudad, con comodidades y elegancia en equilibrio, con áreas.",
  },
];

type Props = { imageUrls?: { main: string; side: string }[] };

export default function TerrainSlider({ imageUrls }: Props = {}) {
  const slides = DEFAULT_SLIDES.map((s, i) => ({
    ...s,
    main: imageUrls?.[i]?.main || s.main,
    side: imageUrls?.[i]?.side || s.side,
  }));
  const sectionRef      = useRef<HTMLDivElement>(null);
  const mainImgRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const sideImgRefs     = useRef<(HTMLButtonElement | null)[]>([]);
  const indexRef        = useRef(0);
  const accRef          = useRef(0);
  const animatingRef    = useRef(false);
  const applyEffectsRef = useRef<((newIndex: number, direction: number) => void) | null>(null);

  useEffect(() => {
    const FADE_DUR     = 800;
    const ELEVATOR_DUR = 700;
    const THRESHOLD    = 70;

    function applyEffects(newIndex: number, direction: number) {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const oldIndex = indexRef.current;

      // Efecto 1 — fade imagen central
      mainImgRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = `opacity ${FADE_DUR}ms ease`;
        el.style.opacity    = i === newIndex ? "1" : "0";
      });

      // Efecto 2 — elevator libre imagen derecha
      const outY    = direction > 0 ? "-110%" : "110%";
      const inFromY = direction > 0 ? "110%"  : "-110%";

      const outEl = sideImgRefs.current[oldIndex];
      const inEl  = sideImgRefs.current[newIndex];

      if (outEl) {
        outEl.style.transition = `transform ${ELEVATOR_DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${ELEVATOR_DUR}ms ease`;
        outEl.style.transform  = `translateY(${outY})`;
        outEl.style.opacity    = "0";
      }

      if (inEl) {
        // Posicionar sin animación, invisible
        inEl.style.transition = "none";
        inEl.style.transform  = `translateY(${inFromY})`;
        inEl.style.opacity    = "0";
        void inEl.offsetHeight; // forzar reflow
        // Animar a posición final, apareciendo
        inEl.style.transition = `transform ${ELEVATOR_DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${ELEVATOR_DUR}ms ease`;
        inEl.style.transform  = "translateY(0%)";
        inEl.style.opacity    = "1";
      }

      indexRef.current = newIndex;
      setTimeout(() => { animatingRef.current = false; }, Math.max(FADE_DUR, ELEVATOR_DUR));
    }

    applyEffectsRef.current = applyEffects;

    let locked = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          locked = true;
          accRef.current = 0;
        } else {
          locked = false;
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    function onWheel(e: WheelEvent) {
      if (!locked) return;
      e.preventDefault();

      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) < THRESHOLD) return;

      const direction = accRef.current > 0 ? 1 : -1;
      accRef.current  = 0;

      const next = indexRef.current + direction;

      if (next < 0 || next >= slides.length) {
        locked = false;
        return;
      }

      applyEffects(next, direction);
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  function goTo(index: number) {
    if (index === indexRef.current) return;
    const direction = index > indexRef.current ? 1 : -1;
    applyEffectsRef.current?.(index, direction);
  }

  return (
    <div ref={sectionRef} className="grid grid-cols-[800px_1fr] gap-x-16 items-start">
      {/* IMAGEN GRANDE (760x760) — crossfade por opacity */}
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
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => { mainImgRefs.current[i] = el; }}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={slide.main}
              alt="Imagen principal"
              fill
              sizes="1860px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* DERECHA (SLIDER + TEXTO) */}
      <div className="flex flex-col items-stretch justify-center h-full pr-10">

        {/* Wrapper de contención — solo este tiene overflow:hidden */}
        <div style={{ height: `${BLOCK_H}px`, overflow: "hidden" }}>

          {/* Thumbnail container — overflow visible para que el elevator sea libre dentro del wrapper */}
          <div
            style={{
              height: `${BLOCK_H}px`,
              position: "relative",
              overflow: "visible",
              zIndex: 1,
            }}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                ref={(el) => { sideImgRefs.current[index] = el; }}
                type="button"
                onClick={() => goTo(index)}
                className={`
                  relative w-full snap-start overflow-hidden
                  transition-all duration-300
                  ${index === 0 ? "opacity-100" : "opacity-55"}
                `}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${BLOCK_H}px`,
                  display: "flex",
                  flexDirection: "column",
                  opacity: index === 0 ? 1 : 0,
                  transform: index === 0 ? "translateY(0%)" : "translateY(110%)",
                }}
              >
                {/* Imagen */}
                <div
                  className="relative w-full shrink-0 overflow-hidden rounded-[24px]"
                  style={{ height: `${IMG_H}px` }}
                >
                  <Image src={slide.side} alt="Imagen lateral" fill className="object-cover" />
                </div>

                {/* Pie de foto */}
                <div className="mt-10 text-center text-[11px] tracking-[0.18em] uppercase">
                  <p className="mb-3 max-w-xs mx-auto">{slide.caption}</p>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black text-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>{/* fin wrapper contención */}

      </div>
    </div>
  );
}
