"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

interface Producto {
  id_producto: number;
  nombre: string;
  categoria: {
    nombre: string;
  };
}

interface ApiResponse {
  message: string;
  status: number;
  data: Producto[];
}

type ChartData = {
  name: string;
  value: number;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text 
      x={x}
      y={y}
      className="text-xs fill-white font-semibold" 
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-600">{`${payload[0].value} productos`}</p>
      </div>
    );
  }
  return null;
};

export default function ProductosPorCategoria() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/empleado/producto');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const apiResponse: ApiResponse = await response.json();
        const productos = apiResponse.data;
        
        if (!Array.isArray(productos)) {
          throw new Error('La respuesta no contiene un array válido en data');
        }
        
        const categoryCounts: Record<string, number> = {};
        
        productos.forEach((producto) => {
          if (producto && producto.categoria) {
            const categoria = producto.categoria.nombre || 'Sin categoría';
            categoryCounts[categoria] = (categoryCounts[categoria] || 0) + 1;
          }
        });

        const data: ChartData[] = Object.entries(categoryCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);

        setChartData(data);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white w-[200px] h-[400px] rounded-lg p-6 shadow-lg flex flex-col items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
        <p className="mt-3 text-black">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-[600px] h-[400px] rounded-lg p-6 shadow-lg flex flex-col items-center justify-center">
        <div className="text-red-500 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-black font-medium">Error al cargar datos</p>
        <p className="text-sm text-gray-600 mt-1">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white w-[500px] h-[400px] rounded-lg p-6 shadow-lg flex items-center justify-center">
        <p className="text-black">No hay productos registrados</p>
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const topCategoria = chartData[0];

  return (
    <div className="bg-white w-[510px] h-[400px] rounded-lg p-6 shadow-lg overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black">Productos por Categoría</h3>
        <p className="text-sm text-black mt-1">Top 8 categorías más populares</p>
      </div>

      <div className="flex">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={chartData as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${entry.name}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="ml-4 w-44 gap-4 pt-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-xs text-black">Total Productos</p>
            <p className="text-lg font-semibold text-black">{total}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs text-black">Top Categoría</p>
            <p className="text-sm font-semibold text-black truncate">{topCategoria.name}</p>
            <p className="text-xs text-gray-600">{topCategoria.value} productos</p>
          </div>

          <div>
            <p className="text-xs text-black">Categorías</p>
            <p className="text-lg font-semibold text-black">{chartData.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}