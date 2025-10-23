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
  cantidad_ubicacion: z.number().int().optional(),
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
    } catch (e: any) {
        if (e.message.includes("Capacidad excedida")) {
          const match = e.message.match(/Capacidad excedida[\s\S]*$/);
          const mensajeLimpio = match ? match[0].trim() : "Capacidad excedida";
    
          return NextResponse.json({
            message: mensajeLimpio,
            status: 400,
          });
        }

    // ⚙️ Para cualquier otro error
    return NextResponse.json({
      message: "Error al registrar el movimiento",
      error: e.message,
      status: 500,
    });
  }
}

const ubicacion = z.object({
  nombre: z.string().min(10,"el nombre no es valido").max(50),
  capacidad: z.number().int()
})
export async function registarubicacion(req:NextRequest) {
  try{
  const datos = ubicacion.parse(await req.json())
  const stock = await prisma.ubicacion.create({
    data:{
    nombre: datos.nombre,
    capacidad : datos.capacidad
    }
  })
  return NextResponse.json({
    "message" : "ubicacion creada",
    "status" : 200,
    "data" : stock
  })
  }catch(e){
    return NextResponse.json({"message" : "error en registrar ubicacion", "error": e, "status": 404})
  }
}

export async function getstock_ubicaciones(){
  try{
  const stock = await prisma.stock_ubicacion.findMany({
    include : {
      ubicacion:{
        select: {
        nombre: true,
        capacidad: true
        }        
      },
      productos : {
        select: {
          nombre: true,
          description: true,
          categoria:{
            select:{
              nombre: true
            }
          }
        }
      },
    }
  })

  return NextResponse.json({"message": "lista de ubicaciones con el stock", "status" : 200, "data": stock});
  }catch(e){
   return NextResponse.json({"message": "lista no disponible", "status" : 404, "error": e})
  }
}

export async function getmovimiento(){

  try{
  const stock = await prisma.movimiento_inventario.findMany({
  select: {
    cantidad_movida: true,
    tipo_movimiento: true,
    observaciones: true,
    productos: {
      select: {
        nombre: true,
        categoria:{
          select:{
            nombre: true
          }
        }
      }
    },
    usuarios: {
      select:{
        users: true,
        empleado: {
          select: {
            nombre: true,
            apellido: true,
            rol: true
          }
        }
      }
    }
  }
});

  return NextResponse.json({"message": "lista de ubicaciones con la capacidad", "status" : 200, "data": stock});
  }catch(e){
   return NextResponse.json({"message": "lista no disponible", "status" : 404, "error": e})
  }
}

export async function getubiaciones(){
  try{
  const stock = await prisma.ubicacion.findMany({
    select:{
      nombre: true,
      capacidad: true
    }
  })
  return NextResponse.json({"message": "lista de ubicaciones con el stock", "status" : 200, "data": stock});
  }catch(e){
   return NextResponse.json({"message": "lista no disponible", "status" : 404, "error": e})
  }
}

//rutas para ingresar el stock de la ubicacion:
const stockUbicacion = z.object({
  id_stock_ubicacion : z.number().int(),
  id_ubicacion: z.number().int(),
  id_producto: z.number().int(),
  cantidad_ubicacion: z.number().int().optional(),
});
export async function updatestockUbicacion(req: NextRequest) {
  try{
  const datos = stockUbicacion.parse(await req.json());
  const stock = await prisma.stock_ubicacion.update({
    where: { id_stock_ubicacion: datos.id_stock_ubicacion },
    data: {
      id_ubicacion: datos.id_ubicacion,
      id_producto: datos.id_producto,
      cantidad_ubicacion: datos.cantidad_ubicacion
    },
  });

  const respuesta = NextResponse.json({
    message: "actualizado correctamente",
    status: 200,
    data: stock,
  });

  return respuesta;
   }catch(e: any){
     console.error("Error al actualizar stock en ubicación:", e);

     const errorMessage =
       e?.meta?.cause ?? // prisma errors suelen tener .meta
       (e instanceof Error ? e.message : String(e)) ??
       "Error desconocido en la base de datos";

    return NextResponse.json(
      {
        message: "No se pudo actualizar el stock en la ubicación",
        excepcion: errorMessage, // opcional: en producción considera quitarlo
        status: 400,
      },
      { status: 400 }
    );
  }
}

const id_stock_ubicacion = z.object({
  id_stock_ubicacion : z.number().int(),
});
export async function deletestock_ubicacion(req: NextRequest) {
  try{
  const datos = id_stock_ubicacion.parse(await req.json());
  const stock = await prisma.stock_ubicacion.delete({
    where: { id_stock_ubicacion: datos.id_stock_ubicacion },
  });

  const respuesta = NextResponse.json({
    message: "eliminado correctamente",
    status: 200,
    data: stock,
  });

  return respuesta;
  }catch(e){
    return NextResponse.json({"message" : "no se pudo encontrar el dato", "exepcion": e, "status" : 400})
  }
}

const registrar = z.object({
  id_ubicacion: z.number().int(),
  id_producto: z.number().int(),
  cantidad_ubicacion: z.number().int().optional(),
});
export async function store_stock_Ubicacion(req: NextRequest) {
  try{
  const datos = registrar.parse(await req.json());
  const stock = await prisma.stock_ubicacion.create({
    data: {
      id_ubicacion: datos.id_ubicacion,
      id_producto: datos.id_producto,
      cantidad_ubicacion: datos.cantidad_ubicacion
    },
  });

  const respuesta = NextResponse.json({
    message: "ingresado correctamente",
    status: 200,
    data: stock,
  });

  return respuesta;
    }catch(e: any){
     console.error("Error al insertar stock en ubicación:", e);

     const errorMessage =
       e?.meta?.cause ?? // prisma errors suelen tener .meta
       (e instanceof Error ? e.message : String(e)) ??
       "Error desconocido en la base de datos";

    return NextResponse.json(
      {
        message: "No se pudo insertar el stock en la ubicación",
        excepcion: errorMessage, // opcional: en producción considera quitarlo
        status: 400,
      },
      { status: 400 }
    );
  }
}