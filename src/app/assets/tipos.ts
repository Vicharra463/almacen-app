import { stock_ubicacion } from "@prisma/client";

export type StockUbicacion = {
  id_stock_ubicacion: number;
  id_ubicacion: number;
  id_producto: number;
  cantidad_ubicacion: number;
  productos: {
    id_producto: number;
    nombre: string;
    id_categoria: number;
    description: string;
  };
  ubicacion: {
    id_ubicacion: number;
    nombre: string;
    capacidad: number;
  };
};

export type UbicacionesResponse = {
  message: string;
  status: number;
  data: {
    cantidad_movida: number;
    tipo_movimiento: string;
    observaciones: string;
    productos: {
      nombre: string;
      categoria: {
        nombre: string;
      };
    };
    usuarios: {
      users: string;
      empleado: {
        nombre: string;
        apellido: string;
        rol: string;
      }[];
    };
  }[];
};

