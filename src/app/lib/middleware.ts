import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "../lib/Token";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    //no trae token no entra
    if(!token){
        return NextResponse.next({
            headers: {"x-auth-status": "unauthorized"}
        })
    }
    //se pasa a verificar
    const user = await verifyToken(token);
    //si este resulta ser no valido no ingresa
    if(!user){
       return NextResponse.next({
      headers: { "x-auth-status": "unauthorized" },
    });
    }
     
    const url = req.nextUrl.clone();

    //usuario no autorizado
    if(url.pathname.startsWith("/admin") && user.role !== "Administrador"){
     return NextResponse.next({
         headers: { "x-auth-status": "forbidden" },
     })
    }
     //usuario autorizado
      return NextResponse.next({
    headers: {
      "x-auth-status": "authorized",
      "x-user-id": user.id.toString(),
      "x-user-role": user.role,
    },
  });

}

  export const config = {
    matcher : ['/admin/:path*', '/dashboard/:path*'],
  };
