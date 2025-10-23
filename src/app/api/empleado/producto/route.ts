import { NextRequest } from "next/server";
import {agregarproducto} from "../../../lib/Services/productoService"
import {actualizarproducto} from "../../../lib/Services/productoService"
import {getproductos} from "../../../lib/Services/productoService"
import {droproducto} from "../../../lib/Services/productoService"


export async function POST(req : NextRequest) {
    const product = await agregarproducto(req)
    return product
}

export async function PUT(req : NextRequest) {
    const product = await actualizarproducto(req)
    return product
}

export async function GET() {
    const product = await getproductos()
    return product
}

export async function DELETE(req: NextRequest) {
    const product = await droproducto(req)
    return product
}