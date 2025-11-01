"use client";

import { getstockmovimientos } from "@/app/forms_client/forms";
import { useEffect, useState } from "react";
import { UbicacionesResponse } from "@/app/assets/tipos";
import { Cargando } from "@/Components/Loading/Loading";
import { Error } from "@/Components/Error/Error";
export default function Movimientos() {
  const [data, setData] = useState<UbicacionesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // 🔹 Cantidad de filas por página

  useEffect(() => {
    getstockmovimientos().then((res) => setData(res));
  }, []);

  if (!data) return <Cargando />;
  if (!data.data?.length) return <p>No hay movimientos registrados.</p>;

  // 🔹 Calcular índices de la paginación
  const totalItems = data.data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.data.slice(startIndex, endIndex);

  // 🔹 Cambiar de página
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-8 bg-white h-full">
  <div className="pb-11">
    <h1 className="text-2xl font-bold pb-8">Movimientos de Stock</h1>
  </div>
  <div className="flex bg-white">
    <table className="table-auto border border-blue-300 w-full">
      <thead className="bg-indigo-100">
        <tr>
          <th className="border border-blue-300 p-2">Tipo</th>
          <th className="border border-blue-300 p-2">Cantidad</th>
          <th className="border border-blue-300 p-2">Observaciones</th>
          <th className="border border-blue-300 p-2">Producto</th>
          <th className="border border-blue-300 p-2">Categoría</th>
          <th className="border border-blue-300 p-2">Usuario</th>
          <th className="border border-blue-300 p-2">Empleado</th>
          <th className="border border-blue-300 p-2">Rol</th>
        </tr>
      </thead>
      <tbody>
        {currentData.map((item, index) => (
          <tr key={index}>
            <td className="border border-blue-300 p-2 text-center">
              {item.tipo_movimiento}
            </td>
            <td className="border border-blue-300 p-2 text-center">
              {item.cantidad_movida}
            </td>
            <td className="border border-blue-300 p-2">
              {item.observaciones}
            </td>
            <td className="border border-blue-300 p-2">
              {item.productos.nombre}
            </td>
            <td className="border border-blue-300 p-2">
              {item.productos.categoria.nombre}
            </td>
            <td className="border border-blue-300 p-2">
              {item.usuarios.users}
            </td>
            <td className="border border-blue-300 p-2">
              {item.usuarios.empleado.map((emp, i) => (
                <div key={i}>
                  {emp.nombre} {emp.apellido}
                </div>
              ))}
            </td>
            <td className="border border-blue-300 p-2 text-center">
              {item.usuarios.empleado.map((emp, i) => (
                <div key={i}>
                  <strong>{emp.rol}</strong>
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Controles de paginación */}
  <div className="flex justify-center items-center gap-4 mt-6">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded disabled:opacity-50"
    >
      ← Anterior
    </button>

    <span>
      Página <strong>{currentPage}</strong> de {totalPages}
    </span>

    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded disabled:opacity-50"
    >
      Siguiente →
    </button>
  </div>
</div>
  );
}
