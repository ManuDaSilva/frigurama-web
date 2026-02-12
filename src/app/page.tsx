"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ApartmentSlider from "@/components/ApartmentSlider";
import TerrainSlider from "@/components/TerrainSlider";
import HousesVillasSlider from "@/components/HousesVillasSlider";

export default function Home() {
  const [villaActive, setVillaActive] = useState({
    title: "Maison Crivela",
    caption:
      "PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y ELEGANCIA EN EQUILIBRIO, CON ÁREAS",
  });

  const [villaHover, setVillaHover] = useState(false);

  return (
    <main className="w-full bg-[#e7ecec] text-black font-sans">
      {/* HERO PRINCIPAL */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Image
          src="/rigurama-logo.png"
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
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          className="mt-12 border border-black px-8 py-2 rounded-full tracking-[0.3em] text-xs uppercase hover:bg-black hover:text-white transition animate-pulse"
        >
          SCROLL
        </button>
      </section>

      {/* SECCIÓN APARTAMENTOS */}
      <section className="bg-[#e7ecec] py-32">
        <div className="mx-auto max-w-[1400px] px-16">
          <div className="grid grid-cols-[360px_760px_320px] gap-x-16 items-start">
            {/* Izquierda */}
            <div className="pt-6">
              <div className="flex items-center justify-between gap-8">
                <h2 className="text-[14px] tracking-[0.22em] uppercase text-neutral-900">
                  APARTAMENTOS
                </h2>

                <Link href="/listings">
                  <button className="px-6 py-2 rounded-full bg-black text-white text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-900 transition">
                    MÁS INFO
                  </button>
                </Link>
              </div>

              <p className="mt-10 leading-[1.8] max-w-[280px] text-[14px] text-neutral-800">
                Proyectos pensados para disfrutar la vida en la ciudad, con
                comodidad y elegancia en equilibrio, con áreas comunes
                inspiradoras, circulaciones eficientes y una estética sobria que
                se mantiene vigente con el paso del tiempo.
              </p>
            </div>

            {/* Slider */}
            <div className="col-span-2">
              <ApartmentSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SECCIÓN CASAS Y VILLAS */}
      <section className="group py-24">
        <div className="mx-auto max-w-[1400px] px-10">
          <div className="grid gap-x-16 items-start lg:grid-cols-[360px_320px_760px]">
            {/* IZQUIERDA: título + botón + texto + preview (solo en hover) */}
            <div>
              <h2 className="text-4xl tracking-[0.35em] uppercase">CASAS Y</h2>
              <h2 className="text-4xl tracking-[0.35em] uppercase mt-2">VILLAS</h2>

              <button className="mt-6 rounded-full bg-black text-white px-7 py-3 text-xs tracking-[0.35em] uppercase">
                MÁS INFO
              </button>

              <p className="mt-8 text-sm leading-7 text-black/70">
                Proyectos pensados para disfrutar la vida en la ciudad, con comodidad y
                elegancia en equilibrio, con áreas comunes inspiradoras, circulaciones
                eficientes y una estética sobria que se mantiene vigente con el paso del
                tiempo.
              </p>

              {/* Preview fijo (aparece SOLO al hacer hover en la sección) */}
              <div className="mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="relative w-[300px] h-[300px] rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.18)] bg-[#e7ecec]">
                  <img
                    src="/houses-preview.jpeg"
                    alt="Preview fija"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* CENTRO: texto que SOLO aparece en hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center h-[760px] text-center">
              <div className="text-black/70" style={{ fontFamily: "serif" }}>
                Maison Crivela
              </div>

              <div className="mt-8 text-xs tracking-[0.35em] uppercase text-black/60 leading-7">
                PROYECTOS PENSADOS PARA DISFRUTAR LA VIDA EN LA CIUDAD, CON COMODIDADES Y
                ELEGANCIA EN EQUILIBRIO, CON ÁREAS
              </div>
            </div>

            {/* DERECHA: slider cuadrado */}
            <div className="justify-self-end">
              <HousesVillasSlider />
            </div>
          </div>
        </div>
      </section>


      {/* SECCIÓN TERRENOS */}
      <section className="bg-[#e7ecec] py-32">
        <div className="mx-auto max-w-[1400px] px-16">
          <div className="grid grid-cols-[360px_760px_320px] gap-x-16 items-start">
            {/* Izquierda */}
            <div className="pt-6">
              <div className="flex items-center justify-between gap-8">
                <h2 className="text-[14px] tracking-[0.22em] uppercase text-neutral-900">
                  TERRENOS/NAVES
                </h2>

                <Link href="/listings">
                  <button className="px-6 py-2 rounded-full bg-black text-white text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-900 transition">
                    MÁS INFO
                  </button>
                </Link>
              </div>

              <p className="mt-10 leading-[1.8] max-w-[280px] text-[14px] text-neutral-800">
                Proyectos industriales y desarrollos de terrenos concebidos para
                optimizar la experiencia de trabajo y operación, donde la
                funcionalidad, la eficiencia y el diseño se integran de forma
                equilibrada para ofrecer espacios productivos, modernos y
                preparados para el crecimiento
              </p>
            </div>

            {/* Slider */}
            <div className="col-span-2">
              <TerrainSlider />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
