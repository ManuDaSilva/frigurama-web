import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* Layout para que el footer quede al final */}
      <div className="min-h-screen flex flex-col">
        {/* separador del header fijo */}
        <div className="pt-[64px] lg:pt-[49px] flex-1">{children}</div>
        {/* footer estilo cabecero */}
        <Footer />
      </div>
    </>
  );
}
