"use client";

import { useEffect, useState } from "react";
import { getproductos } from "@/app/forms_client/forms";
import { StockUbicacionesResponse } from "@/app/assets/tipos";
import Image from "next/image";
export default function DashboardClient() {
  const [data, setData] = useState<StockUbicacionesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 14; // cantidad de filas por página
  const [isOpen, setisOpen] = useState(false);
  useEffect(() => {
    getproductos()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (!data) return <p>Error al cargar los datos</p>;

  // Ordenar por id
  const ordenados = [...data.data].sort(
    (a, b) => a.id_stock_ubicacion - b.id_stock_ubicacion
  );

  // Calcular productos a mostrar según la página
  const indexInicio = (paginaActual - 1) * porPagina;
  const indexFin = indexInicio + porPagina;
  const paginaData = ordenados.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(ordenados.length / porPagina);

  return (
    <div className="p-8 bg-white">
      <div className="pb-11">
        <h1 className="text-2xl font-bold pb-8">Productos del Almacen</h1>
      </div>
      <div className="flex bg-white">
        <table className="table-auto border border-blue-300 w-full">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border border-blue-300 p-2">ID</th>
              <th className="border border-blue-300 p-2">Producto</th>
              <th className="border border-blue-300 p-2">Categoría</th>
              <th className="border border-blue-300 p-2">Ubicación</th>
              <th className="border border-blue-300 p-2">Cantidad</th>
              <th className="border border-blue-300 p-2">observaciones</th>
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
                  {item.productos.categoria.nombre}
                </td>
                <td className="border border-blue-300 p-2">
                  {item.ubicacion.nombre}
                </td>
                <td className="border border-blue-300 p-2 text-center">
                  {item.cantidad_ubicacion}
                </td>
                <td className="border border-blue-300 p-2 text-center aling-center justify-center flex">
                  <button
                    type="button"
                    onClick={() => setisOpen(true)}
                    aria-label="Ver observaciones"
                  >
                    <Image
                      src="/observaciones-icon.png"
                      alt="Logo de TextilPluss"
                      width={30}
                      height={30}
                      priority
                      className="cursor-pointer "
                    />
                  </button>
                  {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg border border-gray-300 w-[400px] h-[140px]">
                        <h1 className="font-bold justify-start flex pl-4">Observaciones: </h1>
                        <p>{item.productos.description}</p>

                        <div className="mt-4 flex  justify-end gap-3">
                          <button
                            onClick={() => setisOpen(false)}
                            className="px-4 py-0.4  cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
