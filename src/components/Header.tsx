"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#e7ecec]">
      {/* margen real tipo ReadyMag */}
      <div className="pt-0">

        {/* ── DESKTOP (lg+) — sin cambios ── */}
        <div
          className="
          hidden lg:flex
          w-full
          items-center justify-between
          h-[81px]
          px-10
          rounded-bl-[64px]
          rounded-br-[64px]
          border border-black/10
          shadow-[0_14px_36px_rgba(0,0,0,0.22)]
          bg-[rgba(0,0,0,0.55)]
          backdrop-blur-xl
          overflow-hidden
          "
        >
          {/* Brillo central largo + viñeta */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[140%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/16 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),rgba(0,0,0,0.40)_65%,rgba(0,0,0,0.55))]" />
          </div>

          <Link href="/" className="relative z-10">
            <Image
              src="/rigurama-logo.svg"
              alt="Frigurama"
              width={180}
              height={72}
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <nav className="relative z-10 flex items-center gap-12 text-white text-[12px] tracking-[0.20em] uppercase">
            <Link href="/listings" className="hover:opacity-70 transition-opacity">
              Inmuebles
            </Link>
            <Link href="/projects" className="hover:opacity-70 transition-opacity">
              Proyectos
            </Link>
            <Link href="/contact" className="hover:opacity-70 transition-opacity">
              Contacto
            </Link>
          </nav>
        </div>

        {/* ── MÓVIL / TABLET (below lg) ── */}
        <div className="relative flex lg:hidden items-center justify-between h-[64px] px-5 rounded-bl-[32px] rounded-br-[32px] border border-black/10 shadow-[0_10px_28px_rgba(0,0,0,0.22)] bg-[rgba(0,0,0,0.55)] backdrop-blur-xl overflow-hidden">
          {/* Brillo + viñeta */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[140%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/16 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),rgba(0,0,0,0.40)_65%,rgba(0,0,0,0.55))]" />
          </div>

          <Link href="/" className="relative z-10" onClick={() => setOpen(false)}>
            <Image
              src="/rigurama-logo.svg"
              alt="Frigurama"
              width={130}
              height={52}
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="relative z-10 flex flex-col justify-center gap-[5px] p-2"
            aria-label="Abrir menú"
          >
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 origin-center ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 origin-center ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* ── MENÚ DESPLEGABLE MÓVIL ── */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-[220px] opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col px-6 py-4 bg-[rgba(0,0,0,0.90)] backdrop-blur-xl">
            <Link
              href="/listings"
              onClick={() => setOpen(false)}
              className="py-4 text-white text-[13px] tracking-[0.22em] uppercase border-b border-white/10 hover:opacity-70 transition-opacity"
            >
              Inmuebles
            </Link>
            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="py-4 text-white text-[13px] tracking-[0.22em] uppercase border-b border-white/10 hover:opacity-70 transition-opacity"
            >
              Proyectos
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-4 text-white text-[13px] tracking-[0.22em] uppercase hover:opacity-70 transition-opacity"
            >
              Contacto
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
}
