import { updatestockUbicacion } from "@/app/lib/Services/stockService";
import { NextRequest } from "next/server";
import { deletestock_ubicacion } from "@/app/lib/Services/stockService";
import { store_stock_Ubicacion } from "@/app/lib/Services/stockService";


export async function PUT(req : NextRequest){
  const stock = await updatestockUbicacion(req)
  return stock;
}


export async function DELETE(req: NextRequest){
  const stock = await deletestock_ubicacion(req)
  return stock;
}


export async function POST(req : NextRequest){
  const stock = await store_stock_Ubicacion(req)
  return stock;
}

