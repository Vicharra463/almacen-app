import prisma from "../db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { singToken } from "../Token"; // Usa "singToken" como está exportado

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
    
    if(usuarioExistente){
      return NextResponse.json({
        message: "el Empleado ya tiene un usuario"
      })

    }

    // 4️⃣ Si no existe → crear usuario + empleado
    const hashedPassword = await bcrypt.hash(limpio.password, 12);

    const existente = await prisma.empleado.findFirst({
      where : { apellido: datosEmpleado.apellido }
    })
    if(datosEmpleado.apellido === existente?.apellido){
      return NextResponse.json({
        message: "Este empleado ya tiene un usuario"
      })
    }

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

    // 5️⃣ Crear token con ambos IDs
    const token = singToken({
      id_usuario: nuevoUsuario.id_usuarios,
      id_empleado: nuevoUsuario.empleado?.[0]?.empleado_id,
      rol: nuevoUsuario.empleado?.[0]?.rol,
    });

    return NextResponse.json({
      status: 200,
      message: "Usuario y empleado registrados correctamente",
      token,
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json(
      { status: 400, message: "Error en el registro", error: errorMessage },
      { status: 400 }
    );
  }
}
