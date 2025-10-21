import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./app/lib/Token";

export async function middleware(req: NextRequest) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Token no encontrado" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ message: "Token inválido" }, { status: 403 });
  }


  if (user.role !== "Administrador") {
    return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/api/empleado/:path*","/api/admin/:path*" ],
  runtime: "nodejs", 
};
