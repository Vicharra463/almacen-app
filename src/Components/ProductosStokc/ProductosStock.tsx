"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ProductoStock {
  nombre: string;
  cantidad: number;
}

interface ApiResponse {
  message: string;
  status: number;
  data: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">{payload[0].payload.nombre}</p>
        <p className="text-sm text-gray-600">{`${payload[0].value.toLocaleString()} unidades`}</p>
      </div>
    );
  }
  return null;
};

export default function TopProductosStock() {
  const [chartData, setChartData] = useState<ProductoStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/empleado/producto");
        if (!res.ok) throw new Error("Error al cargar productos");
        
        const response: ApiResponse = await res.json();
        const productos = response.data || [];

        // Calcular stock total por producto
        const productosConStock = productos
          .map((producto: any) => {
            const stockTotal = (producto.stock_ubicacion || []).reduce(
              (total: number, ubicacion: any) => total + (ubicacion.cantidad_ubicacion || 0),
              0
            );

            return {
              nombre: (producto.nombre || "Sin nombre").substring(0, 15),
              cantidad: stockTotal,
            };
          })
          .filter((item: ProductoStock) => item.cantidad > 0)
          .sort((a: ProductoStock, b: ProductoStock) => b.cantidad - a.cantidad)
          .slice(0, 8);

        setChartData(productosConStock);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="bg-white w-[500px] h-[400px] rounded-lg p-6 shadow-lg flex flex-col items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
        <p className="mt-3 text-black">Cargando stock...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-[500px] h-[400px] rounded-lg p-6 shadow-lg flex flex-col items-center justify-center">
        <div className="text-red-500 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-black font-medium">Error al cargar stock</p>
        <p className="text-sm text-gray-600 mt-1">{error}</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white w-[500px] h-[400px] rounded-lg p-6 shadow-lg flex items-center justify-center">
        <p className="text-black">No hay datos de stock disponibles</p>
      </div>
    );
  }

  const maxStock = chartData[0]?.cantidad || 0;
  const totalStock = chartData.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="bg-white w-[560px] h-[400px] rounded-lg p-6 shadow-lg overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black">Top Productos con Más Stock</h3>
        <p className="text-sm text-black mt-1">Productos con mayor inventario</p>
      </div>

      <div className="flex">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
              barCategoryGap="20%"
            >
              <XAxis
                dataKey="nombre"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#000", fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#000", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
              <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ml-4 w-44 gap-4 pt-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-xs text-black">Mayor Stock</p>
            <p className="text-lg font-semibold text-black">{maxStock.toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs text-black">Stock Total</p>
            <p className="text-lg font-semibold text-black">{totalStock.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs text-black">Productos</p>
            <p className="text-lg font-semibold text-black">{chartData.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}