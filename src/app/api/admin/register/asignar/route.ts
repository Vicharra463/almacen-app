import {registeruser} from "../../../../lib/Services/registerService"
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
   const response = await registeruser(req);
   return response;
}