import { NextRequest, NextResponse } from "next/server";
import prisma from "../db/db";
import { z } from "zod";

export async function getAllStock() {
  const stock = await prisma.stock_ubicacion.findMany({
    include: {
      productos: true,
      ubicacion: true,
    },
  });
  if (stock.length === 0) {
    return { message: "no hay registros en stock" };
  }
  return stock;
}

//actualizar el stock en la ubicacion
const stockSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(8, "se necesita un nombre mas largo"),
  capacidad: z.number().int(),
  cantidad_ubicacion: z.number().int(),
});
export async function getupdate(req: NextRequest) {
  try{
  const datos = stockSchema.parse(await req.json());
  const stock = await prisma.ubicacion.update({
    where: { id_ubicacion: datos.id },
    data: {
      nombre: datos.nombre,
      capacidad: datos.capacidad,
      stock_ubicacion: {
        updateMany: {
          where: { id_ubicacion: datos.id },
          data: { cantidad_ubicacion: datos.cantidad_ubicacion },
        },
      },
    },
  });

  const respuesta = NextResponse.json({
    message: "actualizado correctamente",
    status: 200,
    data: stock,
  });

  return respuesta;
  }catch(e){
    return NextResponse.json({"message" : "no se pudo actualizar la ubicacion", "exepcion": e, "status" : 400})
  }
}

const movimiento = z.object({
  producto_id: z.number().int(),
  usuario_id: z.number().int(),
  tipo_movimiento: z.enum(["Entrada", "ajuste", "retorno"]),
  cantidad_movida: z.number().int(),
  observaciones: z.string().max(500).optional(),
}).strip();
//registrar el movimiento
export async function storestock(req: NextRequest) {
  try{
  const datos = movimiento.parse(await req.json());
  const operacion = await prisma.movimiento_inventario.create({
    data: {
      producto_id: datos.producto_id,
      usuario_id: datos.usuario_id,
      tipo_movimiento: datos.tipo_movimiento,
      cantidad_movida: datos.cantidad_movida,
      observaciones: datos.observaciones
    },
  });
    return NextResponse.json(
      { 
      message: "Movimiento registrado exitosamente",
      operacion 
    }
    )
  }catch(exception){
    return NextResponse.json({ error: "Error al registrar el movimiento", detalles: exception },
      { status: 400 })
  }
}

export async function registarubicacion(req:NextRequest) {
  
}
