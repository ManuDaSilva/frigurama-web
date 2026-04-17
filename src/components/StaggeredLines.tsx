"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  "Gestión segura,",
  "Estrategia de confianza,",
  "Equipo comprometido,",
  "Espacios de ensueño.",
];

export default function StaggeredLines() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      {LINES.map((line, i) => (
        <p
          key={i}
          className="text-lg text-gray-900 font-light leading-[1.15] whitespace-nowrap font-sans"
          style={{
            paddingLeft: visible ? 0 : `${i * 1.5}rem`,
            opacity: visible ? 1 : 0,
            transition: `padding-left 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s, opacity 0.6s ease ${i * 0.08}s`,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
