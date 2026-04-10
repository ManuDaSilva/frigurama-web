"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Card = {
  id: string;
  src: string;
  alt: string;
};

export default function ParallaxCardsSection() {
  const ref = useRef<HTMLElement | null>(null);

  // Scroll progresivo SOLO dentro de esta sección
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // cuando entra por abajo -> cuando sale por arriba
  });

  // Izquierda: sticky (lg:sticky lg:top-32 en el JSX) — no tiene transform
  // Derecha: 3 columnas con velocidades distintas — suave y editorial
  const yCol1 = useTransform(scrollYProgress, [0, 1], [1040,  -2460]);  // media
  const yCol2 = useTransform(scrollYProgress, [0, 1], [380,   -930]);  // ancla, casi quieta
  const yCol3 = useTransform(scrollYProgress, [0, 1], [40,  -80]);  // la más rápida

  // ✅ Mete aquí tus 9 imágenes (rutas en /public)
  const cards: Card[] = [
    { id: "01", src: "/proyectos/01.jpg", alt: "Proyecto 01" },
    { id: "02", src: "/proyectos/02.jpg", alt: "Proyecto 02" },
    { id: "03", src: "/proyectos/03.jpg", alt: "Proyecto 03" },
    { id: "04", src: "/proyectos/04.jpg", alt: "Proyecto 04" },
    { id: "05", src: "/proyectos/05.jpg", alt: "Proyecto 05" },
    { id: "06", src: "/proyectos/06.jpg", alt: "Proyecto 06" },
    { id: "07", src: "/proyectos/07.jpg", alt: "Proyecto 07" },
    { id: "08", src: "/proyectos/08.jpg", alt: "Proyecto 08" },
    { id: "09", src: "/proyectos/09.jpg", alt: "Proyecto 09" },
  ];

  // 3 columnas (3 + 3 + 3)
  const col1 = cards.slice(0, 3);
  const col2 = cards.slice(3, 6);
  const col3 = cards.slice(6, 9);

  return (
    <section
      ref={ref}
      className="
        w-full overflow-hidden
        bg-[#e7ecec]
        text-[var(--foreground)]
      "
    >
      {/* “Altura de sección” para que el movimiento se aprecie bien */}
      <div className="mx-auto max-w-[1900px] px-10 py-24">

        <div className="grid grid-cols-12 gap-10">
          {/* Columna izquierda: texto sticky */}
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-start gap-4">
                <h2 className="text-[36px] font-light tracking-tight uppercase leading-tight">
                  EDIFICIOS<br />Y OFICINAS
                </h2>
                <a href="/listings?type=Oficina">
                  <button className="mt-1 px-5 py-2 rounded-full bg-black text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF8614] transition-colors whitespace-nowrap">
                    MÁS INFO
                  </button>
                </a>
              </div>
              <p className="mt-8 max-w-[340px] text-[17px] leading-[1.15] text-black/70 text-justify" style={{ fontFamily: "var(--font-editorial)", fontStyle: "normal" }}>
                Proyectos de gran envergadura, torres, oficinas y espacios integrales
                diseñados con atención minuciosa para equilibrar funcionalidad y estética,
                creando entornos que inspiran innovación, promueven la eficiencia y potencian el éxito.
              </p>
            </div>
          </div>

          {/* Derecha: grid 3 columnas con parallax */}
          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <motion.div style={{ y: yCol1 }} className="flex flex-col gap-6">
                {col1.map((c) => (
                  <CardItem key={c.id} card={c} />
                ))}
              </motion.div>

              <motion.div style={{ y: yCol2 }} className="flex flex-col gap-6">
                {col2.map((c) => (
                  <CardItem key={c.id} card={c} />
                ))}
              </motion.div>

              <motion.div style={{ y: yCol3 }} className="flex flex-col gap-6">
                {col3.map((c) => (
                  <CardItem key={c.id} card={c} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CardItem({ card }: { card: Card }) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-[34px]
        bg-black/5
        shadow-[0_18px_40px_rgba(0,0,0,0.10)]
      "
    >
      {/* Aspecto tipo ReadyMag */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={card.src}
          alt={card.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 100vw"
          priority={false}
        />
      </div>
    </div>
  );
}
