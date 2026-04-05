"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* margen real tipo ReadyMag */}
      <div className="pt-0">
        <div
          className="
          w-[1910px]
          flex items-center justify-between
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

          <Link
            href="/"
            className="relative z-10 text-white/85 text-[12px] tracking-[0.28em] uppercase"
          >
            FRIGURAMA
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
      </div>
    </header>
  );
}
