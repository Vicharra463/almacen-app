"use client";
import { useState } from "react";

export default function UsuariosPage() {
  const [open, setOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Erick Aquije", correo: "erick@textilplus.com", rol: "Administrador" },
    { id: 2, nombre: "Lucero Rojas", correo: "lucero@textilplus.com", rol: "Empleado" },
  ]);

  const [form, setForm] = useState({ nombre: "", correo: "", rol: "" });

  function agregarUsuario() {
    if (!form.nombre.trim() || !form.correo.trim() || !form.rol.trim()) return;

    const nuevoUsuario = {
      id: usuarios.length + 1,
      ...form,
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setForm({ nombre: "", correo: "", rol: "" });
    setOpen(false);
  }



  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">👥 Usuarios</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Agregar Usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b font-semibold text-center w-16">ID</th>
              <th className="p-3 border-b font-semibold">Nombre</th>
              <th className="p-3 border-b font-semibold">Correo</th>
              <th className="p-3 border-b font-semibold text-center">Rol</th>
              <th className="p-3 border-b font-semibold text-center w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b text-center">{user.id}</td>
                <td className="p-3 border-b">{user.nombre}</td>
                <td className="p-3 border-b">{user.correo}</td>
                <td className="p-3 border-b text-center">{user.rol}</td>
                <td className="p-3 border-b text-center">
                  <button
              
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Agregar nuevo usuario</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  placeholder="Ej. juan@empresa.com"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol del usuario
                </label>
                <input
                  type="text"
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  placeholder="Ej. Administrador o Empleado"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={agregarUsuario}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
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
