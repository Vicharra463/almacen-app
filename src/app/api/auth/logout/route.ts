import { NextResponse } from "next/server";
import {logout} from "../../../lib/Services/auth"

export async function POST() {
  const data = await logout();

  const res = NextResponse.json(data, { status: 200 });

  // ✅ Solo aquí puedes manipular cookies
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), 
  });

  return res;
}