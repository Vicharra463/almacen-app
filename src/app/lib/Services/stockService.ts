import prisma from "../db/db";

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
