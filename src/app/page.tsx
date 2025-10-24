"use client";
import Image from "next/image";
import "../app/globals.css";
import Link from "next/link";
import { useState } from "react";
import { login } from "../app/forms/login_forms";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [error, seterror] = useState("");
 const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
     await login(e);
    
    router.push("/dashboard");
  } catch (err: any) {
    seterror(err.message);
    // No redirige si hay error
  }
};
  return (
    <div>
      <div className="flex justify-start p-2 pl-[40px] items-center border-b-1 border-b-gray-200">
        <Link href={"/"} className="flex">
          <Image
            src="/logo.png"
            alt="Logo de TextilPluss"
            width={50}
            height={40}
            priority
          />
          <h2 className="font-sans font-bold text-[35px] p-3">TextilPlus</h2>
        </Link>
      </div>
      <div className="flex pt-[140px]">
        <div className="w-1/2 flex items-center justify-center ">
          <Image
            src="/inicio.svg"
            alt="Logo de TextilPluss"
            width={700}
            height={800}
            className="max-w-full max-h-[90vh] object-contain pl-10"
            priority
          />
        </div>

        <div className="w-1/2  flex items-center justify-center bg-white text-xl">
          <form
            onSubmit={handlesubmit}
            className="w-[400px] max-w-xl p-8 flex flex-col gap-4 
                   rounded-xl shadow-xl/30 
                   border-1 border-gray-300"
          >
            <h2 className="text-2xl font-semibold text-center mb-4">
              Inicio de Seción
            </h2>
            <div className="flex flex-col gap-4 pb-4">
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                name="usuario"
                id="usuario"
                aria-label="usuario"
                placeholder="Ingrese el Usuario"
                className="border-1 border-gray-300 rounded-sm p-[4px] pl-4"
              />
            </div>

            <div className="flex flex-col gap-4 pb-4">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                name="password"
                id="password"
                aria-label="password"
                placeholder="Ingrese la Contraseña"
                className="border-1 border-gray-300 rounded-sm p-[4px] pl-4"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer text-white bg-blue-400 p-0.5 h-12 w-84 items-center rounded-md"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
