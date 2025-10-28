"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getstockmovimientos } from "@/app/forms_client/forms";

export default function SemiCircleChart() {
  const [totalesPorTipo, setTotalesPorTipo] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function cargarDatos() {
      try {
        const response = await getstockmovimientos();

        const totales = response.data.reduce((acc, movimiento) => {
          const tipo = movimiento.tipo_movimiento;
          
          if (!acc[tipo]) acc[tipo] = 0;
          
          // Convertir a positivo ANTES de sumar
          const cantidadPositiva = Math.abs(movimiento.cantidad_movida);
          acc[tipo] += cantidadPositiva;
          
          return acc;
        }, {} as Record<string, number>);

        setTotalesPorTipo(totales);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando movimientos...</p>
      </div>
    );
  }

  if (Object.keys(totalesPorTipo).length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay movimientos registrados
      </div>
    );
  }

  const maximo = 10000;

  return (
    <div className="w-[790px] h-[400px] p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
  <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
    Movimiento de Stock
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Object.entries(totalesPorTipo).map(([tipo, valor]) => {
      const valorPositivo = Math.abs(valor);
      const porcentaje = Math.min((valorPositivo / maximo) * 100, 100);

      return (
        <div 
          key={tipo} 
          className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: tipo, value: valorPositivo },
                  { name: "Restante", value: Math.max(maximo - valorPositivo, 0) },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                <Cell fill={"#56C934"} />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-4xl font-extrabold mb-1" style={{ color: "#000000" }}>
              {valorPositivo.toLocaleString()}
            </div>
            <div className="text-base font-semibold text-gray-700 mb-1">
              {tipo}
            </div>
            <div className="text-xs text-gray-500">
              {porcentaje.toFixed(1)}%
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
}