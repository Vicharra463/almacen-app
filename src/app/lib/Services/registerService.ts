import prisma from "../db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

const userSchema = z.object({
  users: z.string().min(8, "Se necesita un usuario más largo"),
  password: z.string().min(8, "Se necesita una contraseña más larga"),
});

const empleadoSchema = z.object({
  nombre: z.string().min(3, "Se necesita por lo menos un nombre"),
  apellido: z.string().min(3, "Se necesita por lo menos un apellido"),
  rol: z.enum(["Empleado", "Administrador"]),
});

export async function register(req: NextRequest) {
  try {
    // 1️⃣ Obtener y validar datos
    const { user, empleado } = await req.json();
    const limpio = userSchema.parse(user);
    const datosEmpleado = empleadoSchema.parse(empleado);

    // 2️⃣ Buscar si el usuario ya existe
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { users: limpio.users },
      include: { empleado: true },
    });

    if (usuarioExistente) {
      return NextResponse.json({
        message: "el Empleado ya tiene un usuario",
      });
    }

    // 4️⃣ Si no existe → crear usuario + empleado
    const hashedPassword = await bcrypt.hash(limpio.password, 12);

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        users: limpio.users,
        passwords: hashedPassword,
        empleado: {
          create: {
            nombre: datosEmpleado.nombre,
            apellido: datosEmpleado.apellido,
            rol: datosEmpleado.rol,
          },
        },
      },
      include: { empleado: true },
    });

    const res = NextResponse.json({
      status: 200,
      message: "Usuario y empleado registrados correctamente",
      usuario: nuevoUsuario,
    });

    return res;
  } catch (error) {
    console.error(error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : String(error);
    return NextResponse.json(
      { status: 400, message: "Error en el registro", error: errorMessage },
      { status: 400 }
    );
  }
}

const userasginado = z.object({
  id_empleado: z.number().int(),
  users: z.string().min(4, "Se necesita un usuario más largo"),
  password: z.string().min(4, "Se necesita una contraseña más larga"),
});
export async function registeruser(req: NextRequest) {
  try {
    const json = await req.json();
    const data = userasginado.parse(json);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const empleadoExistente = await prisma.empleado.findUnique({
      where: { empleado_id: data.id_empleado },
    });

    if (!empleadoExistente) {
      return NextResponse.json({
        status: 404,
        message: "Empleado no encontrado",
      });
    }

    if (empleadoExistente.id_users) {
      return NextResponse.json({
        status: 400,
        message: "El empleado ya tiene un usuario asignado",
      });
    }

    const user = prisma.usuarios.create({
      data: {
        users: data.users,
        passwords: hashedPassword,
      },
    });
    const empleado = await prisma.empleado.update({
      where: { empleado_id: data.id_empleado },
      data: {
        id_users: (await user).id_usuarios,
      },
    });
    const nombre = empleado.nombre;
    return NextResponse.json({
      status: 200,
      mensaje: "el usuario se creo y se asigno al empleado",
      nombre,
      user: { users: true },
    });
  } catch (e) {
    return NextResponse.json(
      { status: 400, message: "Error en el registro", error: e },
      { status: 400 }
    );
  }
}
