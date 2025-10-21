import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "./db/db";
dotenv.config();

const SecretKey = process.env.JWT_SECRET_KEY || "123456";

//Se crea el token de autenticacion para la el middleware de las rutas
export function singToken(payload: object) {
  return jwt.sign(payload, SecretKey);
}

interface DecodedToken {
  id: number;
}

// Tipo del usuario que devuelve la verificación
export interface UserToken {
  id: number;
  role: string;
  Usuario: string;
}

//Se verifica la creacion del token verificando si contiene el id del usuario
export async function verifyToken(token: string): Promise<UserToken | null> {
  try {
    const decoded = jwt.verify(token, SecretKey) as DecodedToken;

    const user = await prisma.usuarios.findUnique({
      where: { id_usuarios: decoded.id },
      select: {
        id_usuarios: true,
        users: true,
        empleado: {
          select: {
            rol: true,
          },
        },
      },
    });

    if(!user){
          return null;
    }
    
    const UserToken = {
         id: user.id_usuarios,
        role: user.empleado[0]?.rol ?? "Empleado",
        Usuario: user.users ?? ""
    }
    return UserToken;

  } catch (error) {
    return null;
  }
}
