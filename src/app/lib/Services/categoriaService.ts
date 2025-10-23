import { NextRequest, NextResponse } from "next/server";
import prisma from "../db/db";
import { z } from "zod";

const categoria = z.object({
  nombre: z.string().min(8, "El nombre de la categoria no es valido"),
});

export async function agregarcategoria(req: NextRequest) {
  try {
    const data = categoria.parse(await req.json());
    const cate = await prisma.categoria.create({
      data: {
        nombre: data.nombre,
      },
    });
    return NextResponse.json({
      message: "categoria registrada",
      status: 200,
      data: cate,
    });
  } catch (e) {
    return NextResponse.json({
      message: "error en registrar categoria",
      error: e,
      status: 404,
    });
  }
}

const categoriaupdate = z.object({
  id: z.number().int(),
  nombre: z.string().min(8, "El nombre de la categoria no es valido"),
});

export async function actualizarcategoria(req: NextRequest) {
  try {
    const data = categoriaupdate.parse(await req.json());
    const cate = await prisma.categoria.update({
      where: { id_categoria: data.id },
      data: {
        nombre: data.nombre,
      },
    });
    return NextResponse.json({
      message: "categoria registrada",
      status: 200,
      data: cate,
    });
  } catch (e) {
    return NextResponse.json({
      message: "error en registrar ubicacion",
      error: e,
      status: 404,
    });
  }
}

export async function getcategoria() {
  try {
    const categoria = await prisma.categoria.findMany({
      select: {
        id_categoria: true,
        nombre: true,
      },
    });
    return NextResponse.json({
      message: "lista de categorias",
      status: 200,
      data: categoria,
    });
  } catch (e) {
    return NextResponse.json({
      message: "erro al obtener las categorias",
      error: e,
      status: 404,
    });
  }
}

export async function dropcategoria(req: NextRequest) {
  try {
    const { id } = await req.json();
    const categoria = await prisma.categoria.delete({
      where: { id_categoria: Number(id) },
      select: {
        id_categoria: true,
        nombre: true,
      },
    });
    return NextResponse.json({ status: 200, "message": "Categoria eliminada correctamente" ,data: categoria });
  } catch (e: any) {
    return NextResponse.json(
      {"message": "No se encontro la categoria", status: 400, error: String(e) },
      { status: 400 }
    );
  }
}
