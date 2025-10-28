"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStock } from "@/app/context/ubicacionContex";

const COLORS = {
  background: "#1f2937",
  ocupado: "#3b82f6",
  libre: "#374151",
  text: "#000000",
  textSecondary: "#9ca3af",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-black font-semibold mb-1">{payload[0].payload.name}</p>
        <p className="text-black text-sm">Ocupado: {payload[0].payload.ocupado}%</p>
        <p className="text-black text-sm">Libre: {payload[0].payload.libre}%</p>
      </div>
    );
  }
  return null;
};

const ImprovedBarChart = () => {
  const { stock, loading, error } = useStock();
  const stockArray = stock ?? [];

  // Normalizar y mapear al formato del chart
  const mapped = stockArray.map((item) => {
    const capacidad = item.ubicacion?.capacidad ?? 1;
    const cantidad = item.cantidad_ubicacion ?? 0;
    const ocupado = Math.round((cantidad / capacidad) * 100);
    const libre = Math.max(0, 100 - ocupado);
    return {
      name: item.ubicacion?.nombre ?? `Ubic ${item.id_ubicacion}`,
      ocupado,
      libre,
      raw: item,
    };
  });

  // Restricción: top N más ocupados
  const topCount = 5;
  const chartData = [...mapped]
    .sort((a, b) => b.ocupado - a.ocupado) // descendente por ocupado
    .slice(0, topCount);

  // Estadísticas seguras (evitar división por 0)
  const statsBase = chartData.length > 0 ? chartData : mapped;
  const promedio =
    statsBase.length > 0
      ? Math.round(statsBase.reduce((acc, it) => acc + it.ocupado, 0) / statsBase.length)
      : 0;
  const masOcupado = statsBase.length > 0 ? Math.max(...statsBase.map((it) => it.ocupado)) : 0;
  const masDisponible = statsBase.length > 0 ? Math.max(...statsBase.map((it) => it.libre)) : 0;

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white w-[600px] h-[400px] rounded-lg p-6 shadow-lg overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black">Nivel de Ocupación por Almacén</h3>
        <p className="text-sm text-black mt-1">Porcentaje de capacidad utilizada</p>
      </div>

      <div className="flex">
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }} barCategoryGap="20%">
            <defs>
              <linearGradient id="occupiedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#56C934" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#56C934" stopOpacity={1} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "text-black", fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              height={60}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "text-black", fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span className="text-sm text-black">{value === "ocupado" ? "Espacio Ocupado" : "Espacio Libre"}</span>
              )}
            />

            <Bar dataKey="ocupado" stackId="a" fill="url(#occupiedGradient)" radius={[0, 0, 0, 0]} name="ocupado" />
            <Bar dataKey="libre" stackId="a" fill={COLORS.libre} radius={[4, 4, 0, 0]} name="libre" />
          </BarChart>
        </ResponsiveContainer>

        <div className="ml-4 w-44 gap-4 pt-4 border-t border-gray-700">
          <div>
            <p className="text-xs text-black">Promedio Ocupación</p>
            <p className="text-lg font-semibold text-black">{promedio}%</p>
          </div>

          <div>
            <p className="text-xs text-black">Más Ocupado</p>
            <p className="text-lg font-semibold text-black">{masOcupado}%</p>
          </div>

          <div>
            <p className="text-xs text-black">Más Disponible</p>
            <p className="text-lg font-semibold text-black">{masDisponible}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedBarChart;