"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Types ───────────────────────────────────────────────────── */

type HeroImage = { id: string; url: string };

type Props = {
  images: HeroImage[];
  coverUrl: string | null;
  title: string | null;
  operation: string | null;
  price: number;
  priceHidden: boolean | null;
  communityFees: number | null;
  location: string;
  type: string | null;
  areaM2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

/* ── Formatter ───────────────────────────────────────────────── */

function fmt(n: number): string {
  return (
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"
  );
}

/* ── Component ───────────────────────────────────────────────── */

export default function ListingHero({
  images,
  coverUrl,
  title,
  operation,
  price,
  priceHidden,
  communityFees,
  location,
  type,
  areaM2,
  bedrooms,
  bathrooms,
  contactEmail,
  contactPhone,
}: Props) {
  /* — initial index based on coverUrl — */
  const initialIndex = Math.max(
    images.findIndex((img) => img.url === coverUrl),
    0
  );

  const [index, setIndex] = useState(initialIndex);
  const pausedRef         = useRef(false);
  const resumeTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* — derived labels — */
  const opLabel =
    operation === "alquiler" ? "Alquiler" :
    operation === "venta"    ? "Venta"    : null;

  const TYPE_LABELS: Record<string, string> = {
    Apartamento:    "Apartamento",
    CasaVilla:      "Casa o Villa",
    EdificioOficina:"Edificio / Oficina",
    TerrenoNave:    "Terreno / Nave",
    Local:          "Local",
    Garaje:         "Garaje",
  };
  const typeLabel = type ? (TYPE_LABELS[type] ?? type) : null;
  const priceStr  = !priceHidden ? fmt(price) : null;

  const specs = [
    typeLabel,
    areaM2    ? `${areaM2} m²`       : null,
    bedrooms  ? `${bedrooms} hab.`   : null,
    bathrooms ? `${bathrooms} baños` : null,
  ].filter(Boolean) as string[];

  const contactHref = `mailto:${contactEmail ?? "info@frigurama.com"}?subject=${encodeURIComponent(
    `Interés en ${title ?? "inmueble"}`
  )}`;

  /* — navigation — */
  const goTo = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
  }, []);

  const pauseAndGoTo = (nextIndex: number) => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 4000);
    goTo(nextIndex);
  };

  /* — autoplay — */
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((prev) => (prev + 1) % images.length);
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  /* — cleanup resume timer on unmount — */
  useEffect(
    () => () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    },
    []
  );

  const hasMultiple = images.length > 1;
  const showDots      = hasMultiple && images.length <= 12;

  /* ── Render ─────────────────────────────────────────────────── */

  return (
    <section className="w-full bg-[#e7ecec]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,480px)_1fr] lg:min-h-[88vh]">

        {/* ══ INFO PANEL ══════════════════════════════════════════ */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-12 lg:py-16 order-2 lg:order-1">

          {/* Back */}
          <Link
            href="/listings"
            className="text-[10px] tracking-[0.28em] uppercase text-black/55 hover:text-black/80 transition-colors mb-6 self-start"
          >
            ← Inmuebles
          </Link>

          {/* Operation badge */}
          {opLabel && (
            <span className="self-start mb-4 text-[9px] tracking-[0.35em] uppercase border border-black/20 px-3 py-1.5 rounded-full text-black/55">
              {opLabel}
            </span>
          )}

          {/* Title */}
          <h1 className="font-editorial font-light text-[2rem] sm:text-[2.4rem] leading-[1.07] tracking-[-0.01em] text-black/88 mb-2">
            {title ?? "Inmueble"}
          </h1>

          {/* Location */}
          {location && location !== "—" && (
            <p className="text-sm text-black/60 tracking-wide mb-6">{location}</p>
          )}

          {/* Price */}
          <div className="mb-6">
            {priceStr ? (
              <>
                <p className="text-[2.2rem] sm:text-[2.6rem] font-editorial font-light leading-none text-black/88">
                  {priceStr}
                  {operation === "alquiler" && (
                    <span className="text-lg text-black/55 ml-2">/mes</span>
                  )}
                </p>
                {communityFees != null && communityFees > 0 && (
                  <p className="mt-1.5 text-xs text-black/55 tracking-wide">
                    Comunidad · {communityFees} €/mes
                  </p>
                )}
              </>
            ) : (
              <p className="text-xl text-black/50 tracking-wide">
                Precio a consultar
              </p>
            )}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="flex flex-wrap items-center gap-y-1 text-[11px] tracking-[0.18em] uppercase text-black/60 mb-8">
              {specs.map((s, i) => (
                <span key={s} className="flex items-center">
                  {i > 0 && (
                    <span className="mx-3 text-black/20" aria-hidden>·</span>
                  )}
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col items-start gap-3">
            <a
              href="#detalles"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-[11px] font-medium tracking-[0.25em] uppercase text-white hover:bg-[#FF8614] transition-colors"
            >
              Más detalles
            </a>
            <a
              href={contactHref}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/60 hover:text-black/80 transition-colors"
            >
              <span className="text-black/45" aria-hidden>↗</span>
              {contactEmail ?? "info@frigurama.com"}
            </a>
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/60 hover:text-black/80 transition-colors"
              >
                <span className="text-black/45" aria-hidden>↗</span>
                {contactPhone}
              </a>
            )}
          </div>

        </div>

        {/* ══ IMAGE PANEL ═════════════════════════════════════════ */}
        <div
          className="relative order-1 lg:order-2 aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto bg-black overflow-hidden"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {images.length === 0 ? (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-400 tracking-wide">Sin imágenes</span>
            </div>
          ) : (
            images.map((img, i) => (
              <Image
                key={img.id}
                src={img.url}
                alt={title ?? "Inmueble"}
                fill
                priority={i === initialIndex}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={`object-cover transition-opacity duration-700 ease-in-out ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          )}

          {/* Prev / Next arrows */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() =>
                  pauseAndGoTo((index - 1 + images.length) % images.length)
                }
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm text-white hover:bg-black/40 transition-colors flex items-center justify-center text-sm select-none"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => pauseAndGoTo((index + 1) % images.length)}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm text-white hover:bg-black/40 transition-colors flex items-center justify-center text-sm select-none"
              >
                →
              </button>

              {/* Counter */}
              <div className="absolute bottom-4 right-5 text-[10px] tracking-[0.25em] text-white/60 tabular-nums select-none">
                {String(index + 1).padStart(2, "0")} ·{" "}
                {String(images.length).padStart(2, "0")}
              </div>

              {/* Dot indicators */}
              {showDots && (
                <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pauseAndGoTo(i)}
                      aria-label={`Imagen ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === index
                          ? "bg-white scale-110"
                          : "bg-white/38 hover:bg-white/65"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
}
