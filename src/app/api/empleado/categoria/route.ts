import { NextRequest } from "next/server";
import {agregarcategoria} from "../../../lib/Services/categoriaService"
import {getcategoria} from "../../../lib/Services/categoriaService"
import {dropcategoria} from "../../../lib/Services/categoriaService"


export async function POST(req: NextRequest) {
    const categoria = await agregarcategoria(req);
    return categoria;
}
export async function GET() {
    const categoria = await getcategoria();
    return categoria;
}

export async function DELETE(req: NextRequest) {
  const categoria = await dropcategoria(req);
  return categoria;
}