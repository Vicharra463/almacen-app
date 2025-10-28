"use server";

import { cookies } from "next/headers";
import { verifyToken } from "../Token";
import { StockUbicacion } from "../../assets/tipos";
export async function cliente() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const data = await verifyToken(token);
  return data;
}


