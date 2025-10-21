import { getupdate } from "@/app/lib/Services/stockService";
import { NextRequest } from "next/server";


export async function PUT(req: NextRequest) {
  const stock = await getupdate(req);
  return stock;
}
