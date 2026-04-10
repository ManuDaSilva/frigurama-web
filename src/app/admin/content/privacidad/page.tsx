"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSaveFeedback } from "@/hooks/useSaveFeedback";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg bg-white min-h-[480px] flex items-center justify-center text-sm text-gray-400">
      Cargando editor…
    </div>
  ),
});

type PrivacidadContent = { body: string };

const DEFAULT_BODY = `<h1>Política de Privacidad — Frigurama Inmobiliaria</h1>
<p>El responsable del sitio web pone a disposición de los usuarios el presente documento con el que pretende dar cumplimiento a las obligaciones dispuestas en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD), la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), y la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE).</p>
<p>Toda persona que acceda a este sitio web asume el papel de usuario, comprometiéndose a la observancia y cumplimiento riguroso de las disposiciones aquí dispuestas, así como a cualquier otra disposición legal que fuera de aplicación.</p>
<h2>1. Responsable del tratamiento</h2>
<p><strong>Empresa:</strong> FRIGURAMA — Inmobiliaria Frigurama<br/><strong>Titular:</strong> Ana Maria Amat Urbina<br/><strong>Dirección:</strong> C/ de Muntaner, 200, 3.º 4.ª — Eixample, 08036 Barcelona<br/><strong>Teléfono:</strong> 934 763 494<br/><strong>Email:</strong> info@frigurama.com</p>
<h2>2. Finalidades del tratamiento</h2>
<h3>2.1 Finalidades de naturaleza contractual</h3>
<ul><li>Contratar, mantener y hacer seguimiento del cumplimiento de los contratos de prestación de servicios.</li><li>Cumplir con las obligaciones legales derivadas de nuestra actividad (contabilidad, fiscalidad, etc.).</li></ul>
<h3>2.2 Finalidades basadas en el interés legítimo</h3>
<ul><li>Desarrollar acciones comerciales para ofrecerle y/o recomendarle servicios de Inmobiliaria Frigurama que puedan resultar de su interés.</li><li>Comunicar sus datos a empresas colaboradoras, exclusivamente cuando contrate alguno de sus servicios a través de nosotros.</li><li>Tratar y/o comunicar datos a terceros (Administraciones Públicas) para prevenir, investigar y/o descubrir el fraude.</li></ul>
<h3>2.3 Finalidades que requieren su consentimiento</h3>
<ul><li>Comunicación de datos personales a Inmobiliaria Frigurama para el desarrollo de acciones comerciales y promocionales.</li></ul>
<h2>3. Legitimación</h2>
<ul><li><strong>Ejecución de un contrato:</strong> necesario para la prestación del servicio.</li><li><strong>Cumplimiento de obligaciones legales:</strong> normativa contable, fiscal y mercantil.</li><li><strong>Interés legítimo:</strong> para las finalidades del apartado 2.2.</li><li><strong>Consentimiento del interesado:</strong> para las finalidades del apartado 2.3.</li></ul>
<h2>4. Destinatarios</h2>
<ul><li>Entidades bancarias y financieras.</li><li>Empresas colaboradoras.</li><li>Proveedores de servicios informáticos.</li><li>Administraciones Públicas.</li></ul>
<p>No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo.</p>
<h2>5. Plazo de conservación</h2>
<p>Los datos se conservarán mientras se mantenga la relación comercial o contractual y no se solicite su supresión.</p>
<h2>6. Derechos de los interesados</h2>
<p>Usted tiene derecho a: Acceso, Rectificación, Supresión, Limitación, Oposición, Portabilidad y Retirada del consentimiento. Para ejercerlos: <strong>info@frigurama.com</strong>. También puede reclamar ante la AEPD en www.aepd.es.</p>
<h2>7. Procedencia de los datos</h2>
<p>Los datos proceden directamente del interesado. Se tratan datos identificativos, información comercial y datos económico-financieros. No se tratan categorías especiales.</p>
<h2>8. Comunicaciones comerciales</h2>
<p>Para darse de baja de comunicaciones comerciales, envíe un email a info@frigurama.com con el asunto "Baja comunicaciones comerciales".</p>
<p><em>Última actualización: abril de 2026</em></p>`;

export default function AdminPrivacidadPage() {
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loaded, setLoaded] = useState(false);
  const { saving, setSaving, message, setMessage } = useSaveFeedback();

  useEffect(() => {
    fetch("/api/content/privacidad")
      .then((r) => r.json())
      .then((data: PrivacidadContent) => {
        setBody(data.body || DEFAULT_BODY);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/content/privacidad", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: "Guardado correctamente." });
    } catch {
      setMessage({ type: "error", text: "Error al guardar." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/content" className="text-sm text-gray-400 hover:text-black transition-colors">
            ← Contenido
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-bold">Política de Privacidad</h1>
        </div>
        <Link href="/privacy" target="_blank" className="text-xs text-gray-400 hover:text-black transition-colors">
          Ver página →
        </Link>
      </div>

      {loaded && <RichTextEditor content={body} onChange={setBody} />}

      <div className="flex items-center gap-4 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-black/80 disabled:opacity-50 transition"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
        {message && (
          <span className={`text-sm px-3 py-1.5 rounded-md border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? "✓ " : "✕ "}{message.text}
          </span>
        )}
      </div>
    </div>
  );
}
