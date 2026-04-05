import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Variable.woff2",         style: "normal" },
    { path: "../../public/fonts/Satoshi-VariableItalic.woff2",   style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const editorialNew = localFont({
  src: [
    { path: "../../public/fonts/PPEditorialNew-Ultralight.otf",       weight: "200", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-UltralightItalic.otf", weight: "200", style: "italic" },
    { path: "../../public/fonts/PPEditorialNew-Regular.otf",          weight: "400", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-Italic.otf",           weight: "400", style: "italic" },
  ],
  variable: "--font-editorial",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Frigurama",
    template: "%s | Frigurama",
  },
  description:
    "Gestión inmobiliaria 360º con metodología propia. Compra, venta y alquiler de pisos, chalets, locales y más en Barcelona.",
  openGraph: {
    siteName: "Frigurama",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&loading=async`}
          strategy="afterInteractive"
        />
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${satoshi.variable} ${satoshi.className} ${editorialNew.variable} ${geistMono.variable} antialiased bg-[#e7ecec] text-black`}
      >
        {children}
      </body>
    </html>
  );
}
