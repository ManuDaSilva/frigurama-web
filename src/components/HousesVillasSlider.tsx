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

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    main: "/casa-1.jpg",
    preview: "/casa-4.jpg",
    label: " ",
    caption:
      "PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y ELEGANCIA EN EQUILIBRIO, CON ÁREAS",
  },
  {
    id: 2,
    main: "/casa-2.jpg",
    preview: "/casa-5.jpg",
    label: " ",
    caption:
      "PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y ELEGANCIA EN EQUILIBRIO, CON ÁREAS",
  },
  {
    id: 3,
    main: "/casa-3.jpg",
    preview: "/casa-6.jpg",
    label: " ",
    caption:
      "PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y ELEGANCIA EN EQUILIBRIO, CON ÁREAS",
  },
];

type Props = {
  className?: string;
  imageUrls?: { main: string; preview: string }[];
};

export default function HousesVillasSlider({ className = "", imageUrls }: Props) {
  const slides = DEFAULT_SLIDES.map((s, i) => ({
    ...s,
    main: imageUrls?.[i]?.main || s.main,
    preview: imageUrls?.[i]?.preview || s.preview,
  }));
  const sectionRef  = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const MAIN_W = 780;
  const MAIN_H = 720;
  const GAP = 48;
  const STEP = MAIN_W + GAP;

  // Sync active index from internal scroll
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

  // Scroll hijack: congela la página y mueve las imágenes con la rueda
  useEffect(() => {
    const el      = scrollerRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    let locked = false;
    let intersecting = false;
    let hovering = false;
    let currentIndex = 0;
    let accumulated = 0;
    const THRESHOLD = 200;

    const goTo = (index: number, instant = false) => {
      currentIndex = index;
      el.scrollTo({ left: index * STEP, behavior: instant ? "auto" : "smooth" });
    };

    const onWheel = (e: WheelEvent) => {
      if (!locked) return;
      // No scroll hijack en móvil/tablet
      if (window.matchMedia("(max-width: 1023px)").matches) return;
      e.preventDefault();

      accumulated += e.deltaY;

      if (Math.abs(accumulated) < THRESHOLD) return;

      const direction = accumulated > 0 ? 1 : -1;
      const acc = accumulated;
      accumulated = 0;

      const next = currentIndex + direction;

      if (next < 0 || next >= slides.length) {
        locked = false;
        window.scrollBy({ top: acc });
        return;
      }

      goTo(next);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        // No activar scroll hijack en móvil/tablet
        if (window.matchMedia("(max-width: 1023px)").matches) return;
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.75) {
          // Bien dentro — resetear y bloquear
          intersecting = true;
          const fromBelow = entry.boundingClientRect.top > 0;
          goTo(fromBelow ? 0 : slides.length - 1, true);
          locked = true;
          accumulated = 0;
        } else if (ratio < 0.01) {
          // Completamente fuera — desbloquear
          intersecting = false;
          if (!hovering) locked = false;
        }
        // Entre 0.01 y 0.75: mantener estado actual (histéresis)
      },
      { threshold: [0, 0.75] }
    );

    function onMouseEnter() {
      hovering = true;
      // No forzar locked — solo el IntersectionObserver al 75% activa el hijack
    }
    function onMouseLeave() {
      hovering = false;
      if (!intersecting) locked = false;
    }
    function onPointerDown() {
      hovering = true;
      // Ídem — no forzar locked desde eventos de puntero
    }
    function onPointerUp() {
      // Si el ratón sigue encima no hacemos nada — onMouseLeave se encarga
    }

    // Mantener currentIndex en sync con el scroll nativo (touch)
    function onScrollSync() {
      if (!el) return;
      currentIndex = Math.max(0, Math.min(slides.length - 1, Math.round(el.scrollLeft / STEP)));
    }
    el.addEventListener("scroll", onScrollSync, { passive: true });

    // Touch — swipe horizontal cambia slide
    let touchStartX = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX;
    }
    function onTouchEnd(e: TouchEvent) {
      const deltaX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(deltaX) < 60) return;
      const direction = deltaX > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(slides.length - 1, currentIndex + direction));
      goTo(next);
    }

    // Observar el div raíz (igual que ApartmentSlider con sectionRef)
    // El scrollerRef (interno) activaba el 75% con la sección menos centrada
    observer.observe(section);
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", onWheel);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("scroll",     onScrollSync);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  const current = slides[active];

  return (
    <div ref={sectionRef} className={`group relative w-full lg:w-[1580px] ${className}`}>
      <div className="flex flex-col lg:grid lg:grid-cols-[700px_780px] lg:items-end lg:gap-16">
        {/* ZONA IZQUIERDA: preview + caption — solo desktop (hover) */}
        <div className="hidden lg:flex relative left-[-430px] top-[-20px] h-[430px] items-end">
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
          <div className="relative lg:left-[-210px] w-full lg:w-[780px] lg:shrink-0">
            <div
              ref={scrollerRef}
              className="w-full lg:w-[780px] overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
              style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
            >
            <div className="flex gap-4 lg:gap-12">
              {slides.map((s) => (
                <div key={s.id} className="snap-start shrink-0 w-full lg:w-auto">
                  <div className="relative h-[280px] md:h-[420px] lg:h-[720px] w-full lg:w-[780px] overflow-hidden rounded-[20px] lg:rounded-[30px] bg-[#e7ecec]">
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

          {/* Indicador de progreso */}
          <div className="mt-4 flex items-center justify-center gap-2 pointer-events-none">
            {slides.map((_, i) => (
              <span
                key={i}
                className="block rounded-full bg-black transition-all duration-300"
                style={{ width: i === active ? "20px" : "8px", height: "8px", opacity: i === active ? 1 : 0.3 }}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
