// src/app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frigurama — En construcción",
  description:
    "Estamos trabajando en la nueva web de Frigurama. Contacto: info@frigurama.com / 934 76 34 94",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#eef1ee] text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">
        {/* Card */}
        <div className="w-full rounded-3xl border border-black/10 bg-white/70 p-8 shadow-[0_12px_50px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Sitio temporal
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                En construcción
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-700">
                Estamos preparando la nueva web de Frigurama. Volvemos pronto con
                una experiencia mejorada.
              </p>

              <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-sm font-medium text-neutral-900">
                  Contacto
                </p>

                <div className="mt-3 grid gap-2 text-neutral-700">
                  <a
                    className="w-fit underline decoration-black/20 underline-offset-4 hover:decoration-black/60"
                    href="mailto:info@frigurama.com"
                  >
                    info@frigurama.com
                  </a>

                  <a
                    className="w-fit underline decoration-black/20 underline-offset-4 hover:decoration-black/60"
                    href="tel:+34934763494"
                  >
                    934 76 34 94
                  </a>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="mailto:info@frigurama.com"
                    className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90"
                  >
                    Escribir email
                  </a>

                  <a
                    href="tel:+34934763494"
                    className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-black/5"
                  >
                    Llamar
                  </a>
                </div>
              </div>

              <p className="mt-6 text-xs text-neutral-500">
                © {new Date().getFullYear()} Frigurama. Todos los derechos
                reservados.
              </p>
            </div>

            {/* Right: Illustration */}
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-b from-black/[0.04] to-transparent" />
              <div className="rounded-3xl border border-black/10 bg-white p-6">
                <ConstructionIllustration />
                <p className="mt-4 text-center text-sm text-neutral-600">
                  “Estamos levantando algo bonito.”
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tiny footer note */}
        <p className="mt-8 text-center text-xs text-neutral-500">
          Si ves esta página, es normal: es un “modo mantenimiento” mientras se
          termina el diseño final.
        </p>
      </div>
    </main>
  );
}

function ConstructionIllustration() {
  return (
    <svg
      viewBox="0 0 720 420"
      className="h-auto w-full"
      role="img"
      aria-label="Ilustración de obra en construcción"
    >
      {/* Background */}
      <rect x="0" y="0" width="720" height="420" rx="24" fill="#F7F7F7" />
      <rect x="24" y="24" width="672" height="372" rx="20" fill="#FFFFFF" />
      <rect
        x="24"
        y="24"
        width="672"
        height="372"
        rx="20"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
      />

      {/* Ground */}
      <path
        d="M80 332 H640"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Crane */}
      <path
        d="M140 330 V110"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M140 120 H420"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M180 160 L140 120"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M420 120 V210"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect
        x="405"
        y="210"
        width="30"
        height="26"
        rx="6"
        fill="rgba(0,0,0,0.12)"
        stroke="rgba(0,0,0,0.18)"
      />

      {/* Building */}
      <rect
        x="300"
        y="170"
        width="260"
        height="160"
        rx="14"
        fill="#EEF1EE"
        stroke="rgba(0,0,0,0.18)"
      />
      <rect
        x="328"
        y="200"
        width="70"
        height="40"
        rx="10"
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.12)"
      />
      <rect
        x="412"
        y="200"
        width="70"
        height="40"
        rx="10"
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.12)"
      />
      <rect
        x="328"
        y="254"
        width="70"
        height="40"
        rx="10"
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.12)"
      />
      <rect
        x="412"
        y="254"
        width="70"
        height="40"
        rx="10"
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.12)"
      />
      <rect
        x="500"
        y="220"
        width="40"
        height="110"
        rx="12"
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.12)"
      />

      {/* Cone */}
      <path
        d="M210 330 L190 290 H230 L210 330 Z"
        fill="#FFB020"
        stroke="rgba(0,0,0,0.18)"
      />
      <rect
        x="192"
        y="290"
        width="36"
        height="10"
        rx="5"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Text */}
      <text
        x="360"
        y="130"
        textAnchor="middle"
        fontSize="20"
        fill="rgba(0,0,0,0.55)"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
      >
        Frigurama — Modo mantenimiento
      </text>
    </svg>
  );
}
