"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const THUMB_H = 575;
const IMG_H   = 455;

type Slide = {
  id: number;
  main: string;
  side: string;
  caption: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    main: "/apto-main-4.jpg",
    side: "/apto-side-1.jpg",
    caption: "Proyectos pensados para disfrutar la vida en la ciudad, con comodidad y elegancia en equilibrio.",
  },
  {
    id: 2,
    main: "/apto-main-5.jpg",
    side: "/apto-side-2.jpg",
    caption: "Circulaciones eficientes y espacios comunes inspiradores que se mantienen vigentes con el tiempo.",
  },
  {
    id: 3,
    main: "/apto-main-6.jpg",
    side: "/apto-side-4.jpg",
    caption: "Ambientes luminosos, materiales cálidos y una estética sobria y contemporánea.",
  },
];

type Props = { imageUrls?: { main: string; side: string }[] };

export default function ApartmentSlider({ imageUrls }: Props = {}) {
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
  const dotsRef         = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const FADE_DUR     = 800;
    const ELEVATOR_DUR = 700;
    const THRESHOLD    = 200;

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
        inEl.style.transition = "none";
        inEl.style.transform  = `translateY(${inFromY})`;
        inEl.style.opacity    = "0";
        void inEl.offsetHeight; // forzar reflow
        inEl.style.transition = `transform ${ELEVATOR_DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${ELEVATOR_DUR}ms ease`;
        inEl.style.transform  = "translateY(0%)";
        inEl.style.opacity    = "1";
      }

      indexRef.current = newIndex;
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.width   = i === newIndex ? "20px" : "8px";
        dot.style.opacity = i === newIndex ? "1"    : "0.4";
      });
      setTimeout(() => { animatingRef.current = false; }, Math.max(FADE_DUR, ELEVATOR_DUR));
    }

    applyEffectsRef.current = applyEffects;

    let locked      = false;
    let intersecting = false;
    let hovering    = false;

    function resetTo(idx: number) {
      indexRef.current = idx;
      animatingRef.current = false;
      mainImgRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = "none";
        el.style.opacity = i === idx ? "1" : "0";
      });
      sideImgRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = "none";
        el.style.transform = i === idx ? "translateY(0%)" : i < idx ? "translateY(-110%)" : "translateY(110%)";
        el.style.opacity = i === idx ? "1" : "0";
      });
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.width   = i === idx ? "20px" : "8px";
        dot.style.opacity = i === idx ? "1"    : "0.4";
      });
    }

    // threshold [0, 0.75]: bloquea al 75%, desbloquea solo al 0% (histéresis)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.75) {
          intersecting = true;
          const fromBelow = entry.boundingClientRect.top > 0;
          resetTo(fromBelow ? 0 : slides.length - 1);
          locked = true;
          accRef.current = 0;
        } else if (ratio < 0.01) {
          intersecting = false;
          if (!hovering) locked = false;
        }
        // Entre 0.01 y 0.75: zona muerta, no se cambia nada
      },
      { threshold: [0, 0.75] }
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    function onMouseEnter() {
      hovering = true;
      // No forzar locked aquí — el IntersectionObserver al 75% es el único
      // responsable de activar el hijack. Forzarlo en mouseenter bloquea
      // el scroll cuando la sección apenas es visible al entrar desde abajo.
    }
    function onMouseLeave() {
      hovering = false;
      if (!intersecting) locked = false;
    }

    section?.addEventListener("mouseenter", onMouseEnter);
    section?.addEventListener("mouseleave", onMouseLeave);

    // Touch — swipe vertical cambia slide sin bloquear el scroll de página
    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 60) return;
      const direction = deltaY > 0 ? 1 : -1;
      const next = indexRef.current + direction;
      if (next >= 0 && next < slides.length) applyEffects(next, direction);
    }
    section?.addEventListener("touchstart", onTouchStart, { passive: true });
    section?.addEventListener("touchend",   onTouchEnd,   { passive: true });

    function onWheel(e: WheelEvent) {
      if (!locked) return;
      e.preventDefault();

      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) < THRESHOLD) return;

      const direction = accRef.current > 0 ? 1 : -1;
      const accumulated = accRef.current;
      accRef.current = 0;

      const next = indexRef.current + direction;

      if (next < 0 || next >= slides.length) {
        locked = false;
        window.scrollBy({ top: accumulated });
        return;
      }

      applyEffects(next, direction);
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", onWheel);
      section?.removeEventListener("mouseenter", onMouseEnter);
      section?.removeEventListener("mouseleave", onMouseLeave);
      section?.removeEventListener("touchstart", onTouchStart);
      section?.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  function goTo(index: number) {
    if (index === indexRef.current) return;
    const direction = index > indexRef.current ? 1 : -1;
    applyEffectsRef.current?.(index, direction);
  }

  return (
    <div ref={sectionRef} className="flex items-center">
      <div className="grid grid-cols-[800px_1fr] gap-x-16 items-center w-full">

        {/* IMAGEN GRANDE — crossfade por opacity */}
        <div className="relative aspect-square w-[760px] overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.22)] bg-[#e7ecec]">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              ref={(el) => { mainImgRefs.current[i] = el; }}
              className="absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={slide.main}
                alt={slide.caption}
                fill
                sizes="1860px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
          {/* Indicador de progreso */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 pointer-events-none">
            {slides.map((_, i) => (
              <span
                key={i}
                ref={(el) => { dotsRef.current[i] = el; }}
                className="block rounded-full bg-white transition-all duration-300"
                style={{ width: i === 0 ? "20px" : "8px", height: "8px", opacity: i === 0 ? 1 : 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* DERECHA — thumbnails + texto */}
        <div className="flex flex-col items-stretch justify-center pr-10">

          {/* Wrapper de contención — solo este tiene overflow:hidden */}
          <div style={{ height: `${THUMB_H}px`, overflow: "hidden" }}>

          {/* Thumbnail container — overflow visible para que el elevator sea libre dentro del wrapper */}
          <div
            style={{
              height: `${THUMB_H}px`,
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
                className="w-full text-left"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${THUMB_H}px`,
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
                <div className="mt-6 text-center text-[11px] tracking-[0.18em] uppercase">
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
    </div>
  );
}
