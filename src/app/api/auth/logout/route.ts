import { NextResponse } from "next/server";
import {logout} from "../../../lib/Services/auth"

export async function POST(){
    const response = await logout();
    return response;
}