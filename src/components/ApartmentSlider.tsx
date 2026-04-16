"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const IMG_H    = 455;
const SLIDE_H  = 760; // altura del contenedor desktop (= main image aspect-square 760px)

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
  const slideRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const indexRef        = useRef(0);
  const accRef          = useRef(0);
  const animatingRef    = useRef(false);
  const applyEffectsRef = useRef<((newIndex: number, direction: number) => void) | null>(null);
  const dotsRef         = useRef<(HTMLButtonElement | null)[]>([]);
  const rightDotsRef    = useRef<(HTMLButtonElement | null)[]>([]);

  // Mobile carousel
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileIdx, setMobileIdx] = useState(0);

  // Sync active dot for mobile carousel
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setMobileIdx(Math.max(0, Math.min(slides.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const DUR       = 700;
    const THRESHOLD = 200;

    function updateDots(idx: number) {
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.width   = i === idx ? "20px" : "8px";
        dot.style.opacity = i === idx ? "1"    : "0.4";
      });
      rightDotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.height  = i === idx ? "20px" : "8px";
        dot.style.opacity = i === idx ? "1"    : "0.4";
      });
    }

    function applyEffects(newIndex: number, direction: number) {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const oldIndex = indexRef.current;
      const outY     = direction > 0 ? "-105%" : "105%";
      const inFromY  = direction > 0 ? "105%"  : "-105%";

      const outSlide = slideRefs.current[oldIndex];
      const inSlide  = slideRefs.current[newIndex];

      if (outSlide) {
        outSlide.style.transition = `transform ${DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${DUR}ms ease`;
        outSlide.style.transform  = `translateY(${outY})`;
        outSlide.style.opacity    = "0";
      }

      if (inSlide) {
        inSlide.style.transition = "none";
        inSlide.style.transform  = `translateY(${inFromY})`;
        inSlide.style.opacity    = "1";
        void inSlide.offsetHeight; // forzar reflow
        inSlide.style.transition = `transform ${DUR}ms cubic-bezier(0.4,0,0.2,1)`;
        inSlide.style.transform  = "translateY(0%)";
      }

      indexRef.current = newIndex;
      updateDots(newIndex);
      setTimeout(() => { animatingRef.current = false; }, DUR);
    }

    applyEffectsRef.current = applyEffects;

    let locked       = false;
    let intersecting = false;
    let hovering     = false;

    function resetTo(idx: number) {
      indexRef.current = idx;
      animatingRef.current = false;
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = "none";
        el.style.transform  = i === idx ? "translateY(0%)" : i < idx ? "translateY(-105%)" : "translateY(105%)";
        el.style.opacity    = i === idx ? "1" : "0";
      });
      updateDots(idx);
    }

    // threshold [0, 0.75]: bloquea al 75%, desbloquea solo al 0% (histéresis)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.matchMedia("(max-width: 1023px)").matches) return;
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
      },
      { threshold: [0, 0.75] }
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    function onMouseEnter() { hovering = true; }
    function onMouseLeave() {
      hovering = false;
      if (!intersecting) locked = false;
    }

    section?.addEventListener("mouseenter", onMouseEnter);
    section?.addEventListener("mouseleave", onMouseLeave);

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY; }
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
      if (window.matchMedia("(max-width: 1023px)").matches) return;
      e.preventDefault();

      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) < THRESHOLD) return;

      const direction  = accRef.current > 0 ? 1 : -1;
      const accumulated = accRef.current;
      accRef.current   = 0;
      const next       = indexRef.current + direction;

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
    <>
    {/* ── CARRUSEL MÓVIL / TABLET (below lg) — sin cambios ── */}
    <div className="block lg:hidden w-full">
      <div
        ref={mobileScrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4"
        style={{ scrollbarWidth: "none" }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="snap-start shrink-0 w-full">
            <div className="relative w-full overflow-hidden rounded-[20px] shadow-lg bg-[#d8dedd]" style={{ aspectRatio: "4/3" }}>
              <Image src={slide.main} alt={slide.caption} fill className="object-cover" sizes="100vw" />
            </div>
            <p className="mt-4 text-center text-[11px] tracking-[0.15em] uppercase text-black/55 px-4">
              {slide.caption}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        {slides.map((_, i) => (
          <span
            key={i}
            className="block rounded-full bg-black transition-all duration-300"
            style={{ width: i === mobileIdx ? "20px" : "8px", height: "8px", opacity: i === mobileIdx ? 1 : 0.3 }}
          />
        ))}
      </div>
    </div>

    {/* ── SLIDER DESKTOP (lg+) ── */}
    <div ref={sectionRef} className="hidden lg:flex items-center gap-6">

      {/* Stack de slides — overflow hidden recorta los que entran/salen */}
      <div
        className="relative flex-1 min-w-0 overflow-hidden rounded-[28px]"
        style={{ height: `${SLIDE_H}px` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => { slideRefs.current[i] = el; }}
            className="absolute inset-0 grid items-center"
            style={{
              gridTemplateColumns: "760px 1fr",
              columnGap: "64px",
              transform: i === 0 ? "translateY(0%)" : "translateY(105%)",
              opacity: i === 0 ? 1 : 0,
            }}
          >
            {/* Columna izquierda — imagen principal */}
            <div className="relative w-[760px] h-[760px] overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.22)] bg-[#e7ecec]">
              <Image
                src={slide.main}
                alt={slide.caption}
                fill
                sizes="760px"
                className="object-cover"
                priority={i === 0}
              />
            </div>

            {/* Columna derecha — imagen lateral + caption */}
            <div className="flex flex-col items-center justify-center pr-10 h-full">
              <div
                className="relative w-full overflow-hidden rounded-[24px]"
                style={{ height: `${IMG_H}px` }}
              >
                <Image src={slide.side} alt={slide.caption} fill className="object-cover" />
              </div>
              <div className="mt-6 text-center text-[11px] tracking-[0.18em] uppercase">
                <p className="mb-3 max-w-xs mx-auto">{slide.caption}</p>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Dots centrales — fijos sobre la imagen principal */}
        <div className="absolute bottom-4 z-10 flex items-center gap-2" style={{ left: "380px", transform: "translateX(-50%)" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              ref={(el) => { dotsRef.current[i] = el; }}
              onClick={() => goTo(i)}
              className="block rounded-full bg-white transition-all duration-300 cursor-pointer"
              style={{ width: i === 0 ? "20px" : "8px", height: "8px", opacity: i === 0 ? 1 : 0.4 }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Dots laterales derechos — fuera del stack, siempre visibles */}
      <div className="flex flex-col items-center gap-3 shrink-0 pr-4">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            ref={(el) => { rightDotsRef.current[i] = el; }}
            onClick={() => goTo(i)}
            className="block rounded-full bg-black transition-all duration-300 cursor-pointer hover:opacity-70"
            style={{ width: "8px", height: i === 0 ? "20px" : "8px", opacity: i === 0 ? 1 : 0.4 }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

    </div>
    </>
  );
}
