"use client";

import { useEffect, useState } from "react";
import { StockEmpleadoResponse } from "@/app/assets/tipos";

export default function StockUbicacionPage() {
  const [stock, setStock] = useState<StockEmpleadoResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 14;

  useEffect(() => {
    const fetchStock = async () => {
      console.log("🔄 Iniciando fetch de stock...");

      try {
        const res = await fetch("/api/empleado/stock");
        const data = await res.json();
        const stockData = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : null;

        if (!stockData) {
          console.error("⚠️ Estructura inesperada:", data);
          throw new Error("Formato de respuesta no válido");
        }

        setStock(stockData);
        console.log("✅ Stock actualizado:", stockData);
      } catch (err: any) {
        console.error("💥 Error al obtener stock:", err);
        setError(err.message ?? "Error desconocido");
      } finally {
        console.log("🕓 Fetch finalizado");
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const indexInicio = (paginaActual - 1) * porPagina;
  const indexFin = indexInicio + porPagina;
  const paginaData = stock.slice(indexInicio, indexFin);
  const totalPaginas = Math.ceil(stock.length / porPagina);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="text-blue-600 font-medium text-lg">Cargando stock...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="text-red-600 font-semibold text-lg">
          Error al cargar el stock 😥
        </p>
        <p className="text-gray-500 text-sm">({error})</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reintentar
        </button>
      </div>
    );

  if (!stock.length)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">No hay stock registrado aún.</p>
      </div>
    );

  return (
    <div className="p-8 bg-white h-full">
      <div className="pb-11">
        <h1 className="text-2xl font-bold pb-8">Stock por ubicación</h1>
      </div>
      <div className="flex bg-white">
        <table className="table-auto border border-blue-300 w-full">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border border-blue-300 p-2">ID</th>
              <th className="border border-blue-300 p-2">Producto</th>
              <th className="border border-blue-300 p-2">Descripción</th>
              <th className="border border-blue-300 p-2">Ubicación</th>
              <th className="border border-blue-300 p-2">Cantidad</th>
              <th className="border border-blue-300 p-2">Capacidad</th>
            </tr>
          </thead>
          <tbody>
            {paginaData.map((item) => (
              <tr key={item.id_stock_ubicacion}>
                <td className="border border-blue-300 p-2 text-center">
                  {item.id_stock_ubicacion}
                </td>
                <td className="border border-blue-300 p-2">
                  {item.productos.nombre}
                </td>
                <td className="border border-blue-300 p-2">
                  {item.productos.description}
                </td>
                <td className="border border-blue-300 p-2">
                  {item.ubicacion.nombre}
                </td>
                <td className="border border-blue-300 p-2 text-center">
                  {item.cantidad_ubicacion}
                </td>
                <td className="border border-blue-300 p-2 text-center">
                  {item.ubicacion.capacidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
          className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded disabled:opacity-50"
        >
          ← Anterior
        </button>

        <span>
          Página <strong>{paginaActual}</strong> de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}