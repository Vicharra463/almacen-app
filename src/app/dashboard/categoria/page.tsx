"use client";

import { useState } from "react";

export default function CategoriasPage() {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Ropa" },
    { id: 2, nombre: "Juguetes" },
    { id: 3, nombre: "Calzado" },
  ]);

  const agregarCategoria = () => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return;

    const nuevaCategoria = {
      id: categorias.length ? categorias[categorias.length - 1].id + 1 : 1,
      nombre: nombreLimpio,
    };

    setCategorias([...categorias, nuevaCategoria]);
    setNombre("");
    setOpen(false);
  };

  const eliminarCategoria = (id: number) => {
    setCategorias((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📂 Categorías
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Agregar Categoría
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b font-semibold text-center w-16">ID</th>
              <th className="p-3 border-b font-semibold">Nombre</th>
              <th className="p-3 border-b font-semibold text-center w-32">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-3 border-b text-center">{cat.id}</td>
                  <td className="p-3 border-b">{cat.nombre}</td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => eliminarCategoria(cat.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-6 text-gray-500 italic"
                >
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal simple hecho con Tailwind */}
      {open && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Agregar nueva categoría
            </h2>

            <div className="space-y-3">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre de la categoría
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Electrónica"
                onKeyDown={(e) => e.key === "Enter" && agregarCategoria()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={agregarCategoria}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
