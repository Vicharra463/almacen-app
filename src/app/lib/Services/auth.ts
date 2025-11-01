import prisma from "../db/db";
import bcrypt from "bcrypt";
import { singToken } from "../Token";
import { NextResponse } from "next/server";

export async function loginUser(users: string, password: string) {

  const user = await prisma.usuarios.findUnique({
    where: { users },
    include: {
      empleado: true,
    },
  });
  if (!user) {
    return NextResponse.json(
      { message: "Usuario no encontrado" },
      { status: 404 }
    );
  }
  const isvalid = await bcrypt.compare(password, user.passwords || "");
  if (!isvalid) {
    return NextResponse.json(
      { message: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  const token = singToken({
    id: user.id_usuarios,
    role: user.empleado?.[0]?.rol || "Empleado",
  });

  const res = NextResponse.json(
    {
      message: "Login exitoso",
      user: {
        id: user.id_usuarios,
        users: user.users,
        rol: user.empleado?.[0]?.rol || "Empleado",
      },
    },
    { status: 200 }
  );

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res;
}

export async function logout() {
  
  return { message: "Sesión cerrada correctamente" };
}
