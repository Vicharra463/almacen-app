import { NextResponse } from "next/server";
import {loginUser} from "../../../lib/Services/auth"

export async function POST(request: Request){
    const {users, password} = await request.json();
    const response = await loginUser(users, password);
    return response;
}