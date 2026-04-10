import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Frigurama",
  description:
    "Política de privacidad de Frigurama Inmobiliaria. Información sobre el tratamiento de datos personales conforme al RGPD y la LOPDGDD.",
};

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

export default async function PrivacyPage() {
  const row = await prisma.siteContent.findUnique({ where: { section: "privacidad" } });
  const content = (row?.content as PrivacidadContent) ?? { body: DEFAULT_BODY };
  const body = content.body || DEFAULT_BODY;

  return (
    <main className="w-full min-h-screen bg-[#e7ecec] text-black font-sans pt-[81px]">
      <div className="mx-auto w-full max-w-[800px] px-6 py-20">
        <div
          className="
            [&_h1]:text-[42px] [&_h1]:font-bold [&_h1]:leading-[1.05] [&_h1]:tracking-[-0.02em] [&_h1]:text-black/85 [&_h1]:mt-0 [&_h1]:mb-6
            [&_h2]:text-[26px] [&_h2]:font-semibold [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.01em] [&_h2]:text-black/80 [&_h2]:mt-12 [&_h2]:mb-4
            [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-black/75 [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-black/65 [&_p]:mb-5
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-1
            [&_li]:text-[17px] [&_li]:leading-[1.75] [&_li]:text-black/65
            [&_a]:text-black/80 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-black
            [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-black/10 [&_hr]:my-12
            [&_strong]:font-semibold [&_strong]:text-black/80
            [&_em]:italic
          "
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </main>
  );
}
