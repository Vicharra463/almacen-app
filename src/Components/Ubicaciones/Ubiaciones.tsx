"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface UbicacionData {
  nombre: string;
  ocupado: number;
  capacidad: number;
  porcentaje: number;
}

interface ApiResponse {
  message: string;
  status: number;
  data: any[];
}

export default function CapacidadUbicaciones() {
  const [chartData, setChartData] = useState<UbicacionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await fetch("/api/empleado/stock/ubicaciones");
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const response: ApiResponse = await res.json();

        if (!response?.data || !Array.isArray(response.data)) {
          setChartData([]);
          return;
        }

        const ubicaciones = response.data;

        // Agrupar por nombre de ubicación y sumar cantidades
        const grouped: Record<string, UbicacionData> = {};
        ubicaciones.forEach((item: any) => {
          const nombre = item.ubicacion?.nombre || "Sin nombre";
          const capacidad = Number(item.ubicacion?.capacidad) || 1000;
          const cantidad = Number(item.cantidad_ubicacion) || 0;

          if (!grouped[nombre]) {
            grouped[nombre] = { nombre, ocupado: cantidad, capacidad, porcentaje: 0 };
          } else {
            grouped[nombre].ocupado += cantidad;
          }
        });

        // Convertir a array y calcular porcentaje
        let datos: UbicacionData[] = Object.values(grouped).map((ubi) => {
          const porcentaje = (ubi.ocupado / ubi.capacidad) * 100;
          return {
            ...ubi,
            porcentaje: Math.min(Math.max(porcentaje, 0), 100),
            nombre: ubi.nombre.substring(0, 25),
          };
        });

        // Ordenar por porcentaje descendente y tomar top 5
        datos = datos.sort((a, b) => b.porcentaje - a.porcentaje).slice(0, 5);

        setChartData(datos);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const getColor = (porcentaje: number) => {
    if (porcentaje >= 90) return "#ef4444"; // Rojo
    if (porcentaje >= 70) return "#f59e0b"; // Amarillo
    return "#10b981"; // Verde
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando ubicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <div className="text-red-500 mb-2">⚠️ Error al cargar datos</div>
        <p className="text-sm text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow text-gray-500">
        No hay ubicaciones registradas
      </div>
    );
  }

  return (
    <div className="w-[867px] p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
      <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Capacidad y Uso de Almacén
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="nombre" type="category" width={150} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name.toLowerCase() === "porcentaje") return `${value.toFixed(1)}%`;
              return value;
            }}
          />
          <Bar dataKey="porcentaje" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.porcentaje)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex justify-around text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span>Óptimo (&lt;70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span>Alerta (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span>Crítico (&gt;90%)</span>
        </div>
      </div>
    </div>
  );
}

