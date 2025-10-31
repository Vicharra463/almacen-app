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
    <div>
      <h2 className="text-xl font-semibold text-center mt-4">
        Movimientos de Stock
      </h2>

      <div className="flex flex-col items-center min-h-screen p-4">
        <table
          className="table-auto border border-blue-300 min-w-max text-center
          [&_th]:p-3 [&_td]:p-3 bg-white"
        >
          <thead className="bg-indigo-100">
            <tr>
              <th className="border border-blue-300 p-2">Tipo</th>
              <th className="border border-blue-300 p-2">Cantidad</th>
              <th className="border border-blue-300 p-2">Observaciones</th>
              <th className="border border-blue-300 p-2">Producto</th>
              <th className="border border-blue-300 p-2">Categoria</th>
              <th className="border border-blue-300 p-2">Usuario</th>
              <th className="border border-blue-300 p-2">Empleado</th>
              <th className="border border-blue-300 p-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="border p-3 rounded text-center">
                <td>{item.tipo_movimiento}</td>
                <td>{item.cantidad_movida}</td>
                <td>{item.observaciones}</td>
                <td>{item.productos.nombre}</td>
                <td>{item.productos.categoria.nombre}</td>
                <td>{item.usuarios.users}</td>
                {item.usuarios.empleado.map((emp, i) => (
                  <td key={i}>
                    {emp.nombre} {emp.apellido}
                  </td>
                ))}
                {item.usuarios.empleado.map((emp, i) => (
                  <td key={i}>
                    <strong>{emp.rol}</strong>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 Controles de paginación */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-indigo-200 rounded hover:bg-indigo-300 disabled:opacity-50"
          >
            ⬅️ Anterior
          </button>

          <span className="text-gray-700 font-medium">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-indigo-200 rounded hover:bg-indigo-300 disabled:opacity-50"
          >
            Siguiente ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
