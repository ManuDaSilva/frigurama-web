"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export default function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const pausedRef        = useRef(false);
  const resumeTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* — autoplay — */
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent((i) => (i + 1) % images.length);
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  /* — cleanup on unmount — */
  useEffect(() => () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  /* — manual nav: pausa 4s y luego reanuda — */
  const goTo = useCallback((nextIndex: number) => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 4000);
    setCurrent(nextIndex);
  }, []);

  const prev = () => goTo((current - 1 + images.length) % images.length);
  const next = () => goTo((current + 1) % images.length);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-3xl font-light tracking-[0.3em] uppercase text-gray-300">Proyecto</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/9] bg-black group overflow-hidden">

      {/* Todas las imágenes apiladas — crossfade por opacity */}
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${title} — foto ${i + 1}`}
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 text-2xl"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 text-2xl"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
