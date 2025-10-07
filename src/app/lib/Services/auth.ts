import prisma from "../db/db";
import bcrypt from "bcrypt";
import { singToken } from "../Token";
import { NextResponse } from "next/server";

export async function loginUser(users: string, password: string) {
    //buscar 
    const user = await prisma.usuarios.findUnique({
        where: { users },
        include: {
            empleado: true,
        }
      });
      if(!user){
        return NextResponse.json({message: "Usuario no encontrado"},{status: 404});
      }
      const isvalid = await bcrypt.compare(password, user.passwords || "");
      if(!isvalid){
        return NextResponse.json(
            {message: "Contraseña incorrecta"},
            {status: 401}
        );
      }
      const rol = user.empleado.length > 0 ? user.empleado[0].rol : "Empleado";
        const token = singToken({ userID: user.id_usuarios,rol });

        return NextResponse.json({message: "Login exitoso", token, user:{id: user.id_usuarios, users: user.users, rol}},{status: 200});
    
}

