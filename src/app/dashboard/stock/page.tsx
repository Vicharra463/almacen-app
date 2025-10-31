"use client";

import { useEffect, useState } from "react";
import { StockEmpleadoResponse } from "@/app/assets/tipos";

export default function StockUbicacionPage() {
  const [stock, setStock] = useState<StockEmpleadoResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStock = async () => {
      console.log("🔄 Iniciando fetch de stock...");

      try {
        const res = await fetch("/api/empleado/stock");

        console.log("📡 Respuesta HTTP:", res);

        if (!res.ok) {
          console.error("❌ Error HTTP:", res.status, res.statusText);
          throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("📦 Datos JSON recibidos:", data);

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

  // Cálculos de paginación
  const totalPages = Math.ceil(stock.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = stock.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📦 Stock por ubicación
      </h1>

      <div className="mb-4 text-gray-600">
        Mostrando {startIndex + 1} - {Math.min(endIndex, stock.length)} de {stock.length} registros
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b font-semibold text-center">#</th>
              <th className="p-3 border-b font-semibold">Producto</th>
              <th className="p-3 border-b font-semibold">Descripción</th>
              <th className="p-3 border-b font-semibold">Ubicación</th>
              <th className="p-3 border-b font-semibold text-center">
                Cantidad
              </th>
              <th className="p-3 border-b font-semibold text-center">
                Capacidad
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr
                key={item.id_stock_ubicacion}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-3 border-b text-center">
                  {item.id_stock_ubicacion}
                </td>
                <td className="p-3 border-b">{item.productos.nombre}</td>
                <td className="p-3 border-b text-gray-600">
                  {item.productos.description}
                </td>
                <td className="p-3 border-b">{item.ubicacion.nombre}</td>
                <td className="p-3 border-b text-center">
                  {item.cantidad_ubicacion}
                </td>
                <td className="p-3 border-b text-center">
                  {item.ubicacion.capacidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
                className={`px-3 py-2 rounded-lg border transition ${
                  currentPage === page
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}