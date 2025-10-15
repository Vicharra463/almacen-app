import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "123456";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { role?: string };

    // Verificamos permisos solo si es ruta /admin
    if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "Administrador") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

