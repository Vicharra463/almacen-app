// app/dashboard/page.tsx
import { cliente } from "../lib/forms_Server/form";
import Mediocirculo from "../../Components/MedioCirculo/Mediocir";
import BarrasVolumen from "../../Components/Barrasvolumen/BarrasVolumen";
import ProductosPorCategoria from "@/Components/ProductsCategori/ProductosCate";
import TopProductosStock from "@/Components/ProductosStokc/ProductosStock";
import Ubicaciones from "@/Components/Ubicaciones/Ubiaciones";
export default async function Dashboard() {
  const token = await cliente();
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No autorizado. Redirigiendo...</p>
        <meta httpEquiv="refresh" content="0; url=/" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold pb-8">Bienvenido al Dashboard</h1>
      <div className="flex gap-4 pb-4">
        <div >
          <ProductosPorCategoria />
        </div>
        <div >
          <BarrasVolumen />
        </div>
        <div>
          <TopProductosStock />
        </div>
      </div>

      <div className="flex gap-8">
        <Mediocirculo />
        <Ubicaciones />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
