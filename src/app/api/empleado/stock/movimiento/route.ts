import { storestock } from "@/app/lib/Services/stockService";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest){
  const stock = await storestock(req)
  return stock;
}

