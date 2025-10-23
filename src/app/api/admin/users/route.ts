import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@/app/lib/Services/userService";
import { NextRequest } from "next/server";

// GET /api/admin/users
// Si tiene body con {id}, busca uno. Si no, busca todos.
export async function GET(req: NextRequest) {
  try {
    // Clonamos la request para poder leer el body de forma segura
    const data = await req.clone().json();
    if (data && data.id) {
      return await getUserById(data);
    }
  } catch (error) {
    // Si no hay body o no es un JSON válido, asumimos que es para obtener todos
    return await getAllUsers();
  }
  // Por si el body existe pero no tiene id
  return await getAllUsers();
}

// PUT /api/admin/users
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const response = await updateUser(data);
  return response;
}

// DELETE /api/admin/users
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const response = await deleteUser(data);
  return response;
}
