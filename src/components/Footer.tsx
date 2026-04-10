"use client";

import Link from "next/link";

const linkBase =
  "block transition-colors duration-300 ease-out hover:text-[#e67e22]";

export default function Footer() {
  return (
    <footer className="w-full pb-0 bg-[#e7ecec]">
      <div className="px-0">
        <div
          className="
            relative
            w-full
            h-[220px]
            px-10
            rounded-tl-[64px]
            rounded-tr-[64px]
            border border-black/8
            shadow-[0_8px_24px_rgba(0,0,0,0.14)]
            bg-[rgba(0,0,0,0.42)]
            backdrop-blur-md
            overflow-hidden
          "
        >
          {/* Brillo + viñeta (igual que header) */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[140%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),rgba(0,0,0,0.35)_65%,rgba(0,0,0,0.52))]" />
          </div>

          {/* 3 columnas reales */}
          <div className="relative z-10 grid h-full grid-cols-[0.2fr_1fr_auto] items-center">
            {/* Bloque izquierdo: 2 subcolumnas pegadas */}
            <div className="flex items-start gap-16">
              <div className="text-white/60 text-[12px] tracking-[0.22em] uppercase leading-6">
                <Link href="/company" className={linkBase}>
                  Company
                </Link>
                <Link href="/about" className={linkBase}>
                  About
                </Link>
                <Link href="/services" className={linkBase}>
                  Servicios
                </Link>
                <Link href="/privacy" className={linkBase}>
                  Política de privacidad
                </Link>
                <Link href="/cookies" className={linkBase}>
                  Cookies
                </Link>
              </div>

              <div className="text-white/60 text-[12px] tracking-[0.22em] uppercase leading-6">
                <Link href="/comunidad" className={linkBase}>
                  Comunidad
                </Link>
                <Link href="/ayuda" className={linkBase}>
                  Ayuda
                </Link>
              </div>
            </div>

            {/* Centro */}
            <div className="text-white/60 text-[12px] tracking-[0.22em] uppercase leading-6 text-center justify-self-center">
              <Link href="#" className={linkBase}>
                08036. Muntaner, 0200
              </Link>
              <Link href="#" className={linkBase}>
                934763494
              </Link>
              <Link href="mailto:info@frigurama.com" className={linkBase}>
                info@frigurama.com
              </Link>
              <Link href="https://frigurama.com" className={linkBase}>
                frigurama.com
              </Link>
            </div>

            {/* Derecha */}
            <div className="justify-self-end text-right text-white/60">
              <div className="text-[13px] tracking-[0.22em] uppercase transition-colors duration-300 ease-out hover:text-[#e67e22]">
                Frigurama_SL
              </div>
              <div className="mt-1.5 text-[12px] tracking-[0.22em] uppercase opacity-70">
                © {new Date().getFullYear()}
              </div>
              <div className="mt-3 text-[10px] tracking-[0.15em] opacity-40 normal-case">
                Diseño web: Manuel Morillas Da Silva
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
