import {register} from "../../../lib/Services/registerService"
import { NextRequest } from "next/server";

export async function POST(request: Request){
   const nextrequest = new NextRequest(request.url , request);
   const response = await register(nextrequest);
   return response;
}