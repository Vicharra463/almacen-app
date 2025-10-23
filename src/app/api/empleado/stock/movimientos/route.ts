import { storestock } from "@/app/lib/Services/stockService";
import { NextRequest } from "next/server";
import { getmovimiento } from "@/app/lib/Services/stockService";


export async function POST(req : NextRequest){
  const stock = await storestock(req)
  return stock;
}


export async function GET(){
  const stock = await getmovimiento()
  return stock;
}

