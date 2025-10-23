import prisma from "../db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

// Esquema para la actualización de datos del empleado
const updateUserSchema = z.object({
  id: z.number().int(), // ID del empleado para identificarlo
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
  apellido: z.string().min(3, "El apellido debe tener al menos 3 caracteres").optional(),
  rol: z.enum(["Empleado", "Administrador"]).optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
});

const idSchema = z.object({
    id: z.number().int(),
});


// --- SERVICIOS ---

// Obtener todos los usuarios y sus datos de empleado
export async function getAllUsers() {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        usuarios: {
          select: {
            id_usuarios: true,
            users: true,
          },
        },
      },
    });
    return NextResponse.json(empleados);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener los usuarios", error: String(error) },
      { status: 500 }
    );
  }
}

// Obtener un solo usuario por ID (recibido del body)
export async function getUserById(data: any) {
  try {
    const { id } = idSchema.parse(data);
    const empleado = await prisma.empleado.findUnique({
      where: { empleado_id: id },
      include: {
        usuarios: {
          select: {
            id_usuarios: true,
            users: true,
          },
        },
      },
    });

    if (!empleado) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    return NextResponse.json(empleado);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener el usuario", error: String(error) },
      { status: 500 }
    );
  }
}

// Actualizar un usuario
export async function updateUser(data: any) {
  try {
    const validatedData = updateUserSchema.parse(data);
    const { id, nombre, apellido, rol, password } = validatedData;

    // El ID que recibimos es el del empleado, necesitamos el del usuario para la contraseña
    const empleadoActual = await prisma.empleado.findUnique({
      where: { empleado_id: id },
    });

    if (!empleadoActual || !empleadoActual.id_users) {
      return NextResponse.json({ message: "Empleado no encontrado o no está vinculado a un usuario" }, { status: 404 });
    }

    // Actualizar datos del empleado
    const updatedEmpleado = await prisma.empleado.update({
      where: { empleado_id: id },
      data: {
        nombre,
        apellido,
        rol
      },
    });

    // Si se proporcionó una nueva contraseña, actualizarla
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.usuarios.update({
        where: { id_usuarios: empleadoActual.id_users },
        data: {
          passwords: hashedPassword,
        },
      });
    }

    return NextResponse.json({ message: "Usuario actualizado correctamente", data: updatedEmpleado });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar el usuario", error: String(error) },
      { status: 400 }
    );
  }
}

// Eliminar un usuario
export async function deleteUser(data: any) {
  try {
    const { id } = idSchema.parse(data);

    // El ID que recibimos es el del empleado, necesitamos el del usuario para borrarlo
    const empleado = await prisma.empleado.findUnique({
      where: { empleado_id: id },
    });

    if (!empleado || !empleado.id_users) {
      return NextResponse.json({ message: "Empleado no encontrado o no está vinculado a un usuario" }, { status: 404 });
    }

    // Prisma se encargará de la transacción para borrar empleado y usuario
    // ADVERTENCIA: Esto puede fallar si hay movimientos de inventario asociados.
    // La mejor práctica sería "desactivar" al usuario.
    await prisma.usuarios.delete({
      where: { id_usuarios: empleado.id_users },
    });

    return NextResponse.json({ message: "Usuario eliminado correctamente" }, { status: 200 });
  } catch (error) {
    // Capturar error de clave foránea
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json(
            { message: "No se puede eliminar el usuario porque tiene movimientos de inventario registrados. Considere desactivarlo." },
            { status: 409 } // 409 Conflict
        );
    }
    return NextResponse.json(
      { message: "Error al eliminar el usuario", error: String(error) },
      { status: 500 }
    );
  }
}
