import { NextRequest, NextResponse } from "next/server";
import prisma from "../db/db";
import { z } from "zod";

const producto = z.object({
  id_categoria: z.number().int(),
  nombre: z.string().min(5, "ingrese un nombre valido"),
  descripcion : z.string().min(10).max(500)
});

export async function agregarproducto(req: NextRequest) {
  try {
    const data = producto.parse(await req.json());
    const product = await prisma.productos.create({
      data: {
        id_categoria: data.id_categoria,
        nombre: data.nombre,
        description: data.descripcion
      },
    });
    return NextResponse.json({
      message: "producto registrada",
      status: 200,
      data: product,
    });
  } catch (e) {
    return NextResponse.json({
      message: "error en registrar producto",
      error: e,
      status: 404,
    });
  }
}

const productoupdate = z.object({
  id_producto : z.number().int(),
  nombre: z.string().min(5, "ingrese un nombre valido"),
  descripcion : z.string().min(10).max(500),
  id_categoria: z.number().int().optional()
});

export async function actualizarproducto(req: NextRequest) {
  try {
    const data = productoupdate.parse(await req.json());
    const cate = await prisma.productos.update({
      where: { id_producto: data.id_producto },
      data: {
        nombre: data.nombre,
        description: data.descripcion,
        id_categoria: data.id_categoria
      },
    });
    return NextResponse.json({
      message: "producto actualizado",
      status: 200,
      data: cate,
    });
  } catch (e) {
    return NextResponse.json({
      message: "error en actualizar producto",
      error: e,
      status: 404,
    });
  }
}

export async function getproductos() {
  try {
    const producto = await prisma.productos.findMany({
      select: {
        id_producto: true,
        nombre: true,
        categoria : {
            select: {
                nombre: true
            }
        },
        stock_ubicacion:{
            select:{
                cantidad_ubicacion: true,
                ubicacion:{
                    select: {
                        nombre: true
                    }
                }
            }
        }
      },
    });
    return NextResponse.json({
      message: "lista de productos",
      status: 200,
      data: producto,
    });
  } catch (e) {
    return NextResponse.json({
      message: "erro al obtener las productos",
      error: e,
      status: 404,
    });
  }
}

export async function droproducto(req: NextRequest) {
  try {
    const { id } = await req.json();
    const producto = await prisma.productos.delete({
      where: { id_producto: Number(id) },
      select: {
        id_producto: true,
        nombre: true,
        id_categoria: true,
        description: true
      },
    });
    return NextResponse.json({ status: 200, "message": "Producto eliminada correctamente" ,data: producto });
  } catch (e: any) {
    return NextResponse.json(
      {"message": "No se encontro el producto", status: 400, error: String(e) },
      { status: 400 }
    );
  }
}
