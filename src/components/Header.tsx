"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500
      ${scrolled
        ? "bg-[#e7ecec]/90 backdrop-blur border-b border-black/5"
        : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO IZQUIERDA */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/rigurama-logo.png" // pon aquí la versión pequeña si la tienes
            alt="Rigurama"
            width={140}
            height={40}
            className="h-auto w-auto"
          />
        </Link>

        {/* MENÚ DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.25em] uppercase">
          <Link
            href="/listings"
            className="hover:opacity-60 transition-opacity"
          >
            Inmuebles
          </Link>
          <Link
            href="/projects"
            className="hover:opacity-60 transition-opacity"
          >
            Proyectos
          </Link>
          <Link
            href="/contact"
            className="hover:opacity-60 transition-opacity"
          >
            Contacto
          </Link>
        </nav>

        {/* MENÚ MÓVIL SIMPLE (si quieres algo más complejo lo hacemos luego) */}
        <div className="md:hidden text-[11px] tracking-[0.25em] uppercase">
          <Link href="/listings" className="hover:opacity-60 transition-opacity">
            Inmuebles
          </Link>
        </div>
      </div>
    </header>
  );
}
