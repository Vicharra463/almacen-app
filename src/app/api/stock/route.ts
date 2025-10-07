import { NextResponse } from "next/server";
import {getAllStock} from "../../../app/lib/Services/stockService"

export async function GET(){
    const stock = await getAllStock();
    return NextResponse.json(stock);
}
