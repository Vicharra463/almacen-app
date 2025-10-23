
import { NextRequest, NextResponse } from "next/server";
import { 
    registarubicacion, 
    getstock_ubicaciones,
    getupdate 
} from "@/app/lib/Services/stockService";

// Se usa getstock_ubicaciones para listar las ubicaciones
export async function GET() {
  const stock = await getstock_ubicaciones();
  return stock;
}

// Se usa registarubicacion para crear una nueva ubicacion
export async function POST(req: NextRequest) {
  const stock = await registarubicacion(req);
  return stock;
}

// Se usa getupdate para actualizar una ubicacion
export async function PUT(req: NextRequest) {
  const stock = await getupdate(req);
  return stock;
}
