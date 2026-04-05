"use client";

import Image from "next/image";
import Link from "next/link";

import ApartmentSlider from "@/components/ApartmentSlider";
import TerrainSlider from "@/components/TerrainSlider";
import HousesVillasSlider from "@/components/HousesVillasSlider";
import ParallaxCardsSection from "@/components/ParallaxCardsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="w-full bg-[#e7ecec] text-black font-sans">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Image
          src="/rigurama-logo.svg"
          alt="Rigurama logo"
          width={500}
          height={200}
          className="mx-auto"
        />
        <h2 className="mt-10 text-xl tracking-wide italic">
          For Modern Property Owners
        </h2>
        <p className="max-w-3xl text-md mt-6 leading-relaxed">
          EN ®FRIGURAMA TRANSFORMAMOS ESPACIOS EN VALOR. GESTIÓN INMOBILIARIA 360°
          CON METODOLOGÍA PROPIA Y ENFOQUE EN MEDIR RESULTADOS.
        </p>
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="mt-12 border border-black px-8 py-2 rounded-full tracking-[0.3em] text-xs uppercase hover:bg-black hover:text-white transition animate-pulse"
        >
          SCROLL
        </button>
      </section>

      {/* ── APARTAMENTOS ─────────────────────────────────────────────── */}
      <section className="bg-[#e7ecec] py-24 overflow-hidden">
        <div className="flex items-start gap-16 pl-16">
          {/* Izquierda: título + botón + descripción */}
          <div className="pt-2 w-[360px] shrink-0">
            <div className="flex items-start gap-4">
              <h2 className="text-[36px] font-light tracking-tight uppercase leading-tight">
                APARTAMENTOS
              </h2>
              <Link href="/listings">
                <button className="mt-1 px-5 py-2 rounded-full bg-black text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF8614] transition-colors whitespace-nowrap">
                  MÁS INFO
                </button>
              </Link>
            </div>
            <p className="mt-8 leading-[1.9] text-[17px] text-neutral-700 text-justify" style={{ fontFamily: "var(--font-editorial)", fontStyle: "normal" }}>
              Proyectos pensados para disfrutar la vida en la ciudad, con
              comodidad y elegancia en equilibrio, con áreas comunes
              inspiradoras, circulaciones eficientes y una estética sobria que
              se mantiene vigente con el paso del tiempo.
            </p>
          </div>

          {/* Slider: se extiende hasta el borde derecho */}
          <div className="flex-1 min-w-0">
            <ApartmentSlider />
          </div>
        </div>
      </section>

      {/* ── CASAS Y VILLAS ───────────────────────────────────────────── */}
      <section className="bg-[#e7ecec] py-24 overflow-hidden">
        <div className="flex items-start gap-16 pl-16">

          {/* Izquierda: título + botón + descripción */}
          <div className="pt-2 w-[360px] shrink-0">
            <div className="flex items-start gap-4">
              <h2 className="text-[36px] font-light tracking-tight uppercase leading-tight">
                CASAS Y VILLAS
              </h2>
              <button className="mt-1 px-5 py-2 rounded-full bg-black text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF8614] transition-colors whitespace-nowrap">
                MÁS INFO
              </button>
            </div>
            <p className="mt-8 leading-[1.9] text-[17px] text-neutral-700 text-justify" style={{ fontFamily: "var(--font-editorial)", fontStyle: "normal" }}>
              Proyectos pensados para disfrutar la vida en la ciudad, con
              comodidad y elegancia en equilibrio, con áreas comunes
              inspiradoras, circulaciones eficientes y una estética sobria que
              se mantiene vigente con el paso del tiempo.
            </p>
          </div>

          {/* Slider: se extiende hasta el borde derecho */}
          <div className="flex-1 min-w-0">
            <HousesVillasSlider />
          </div>

        </div>
      </section>

      {/* ── EDIFICIOS Y OFICINAS ─────────────────────────────────────── */}
      <ParallaxCardsSection />

      {/* ── TERRENOS / NAVES INDUSTRIALES ────────────────────────────── */}
      <section className="bg-[#e7ecec] py-24 overflow-hidden">
        <div className="flex items-start gap-16 pl-16">
          {/* Izquierda: título + botón + descripción */}
          <div className="pt-2 w-[360px] shrink-0">
            <div className="flex items-start gap-4">
              <h2 className="text-[36px] font-light tracking-tight uppercase leading-tight">
                TERRENOS/<br />NAVES INDUSTRIALES
              </h2>
              <Link href="/listings">
                <button className="mt-1 px-5 py-2 rounded-full bg-black text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF8614] transition-colors whitespace-nowrap">
                  MÁS INFO
                </button>
              </Link>
            </div>
            <p className="mt-8 leading-[1.9] text-[17px] text-neutral-700 text-justify" style={{ fontFamily: "var(--font-editorial)", fontStyle: "normal" }}>
              Proyectos industriales y desarrollos de terrenos concebidos para
              optimizar la experiencia de trabajo y operación, donde la
              funcionalidad, la eficiencia y el diseño se integran de forma
              equilibrada para ofrecer espacios productivos, modernos y
              preparados para el crecimiento.
            </p>
          </div>

          {/* Slider: se extiende hasta el borde derecho */}
          <div className="flex-1 min-w-0">
            <TerrainSlider />
          </div>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────────────────────── */}
      <ContactSection />

    </main>
  );
}
