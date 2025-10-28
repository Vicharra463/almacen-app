import "../app/globals.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cliente } from "@/app/lib/forms_Server/form";
import Btnsalir from "../Components/btnsalir/btnsalir";

export default async function Sidebar() {
  const user = await cliente();
  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <div className="flex flex-col w-[270px] flex-shrink-0 pt-8 p-4 pl-8 text-center gap-4 border-r border-gray-200 text-xl h-full bg-white">
        <div className="gap-[10px] flex flex-col items-center">
          <Image
            src="/icon-textil.png"
            alt="Logo de TextilPluss"
            width={200}
            height={200}
            priority
            className="w-[200px] "
          />
          <p>Opciones</p>
        </div>

        <div className="gap-1 flex flex-col items-center">
          <Link
            href={"/dashboard"}
            className=" w-full rounded-lg flex justify-start gap-2 p-2 hover:bg-blue-300 transition delay-100 duration-300"
          >
            <Image
              src="/icon-dashboard.png"
              alt="Logo de TextilPluss"
              width={25}
              height={40}
              priority
            />
            <h2>Dashboard</h2>
          </Link>
          {user.role === "Administrador" ? (
            <Link
              href={"/"}
              className="w-full rounded-lg flex justify-start gap-2 p-2 hover:bg-blue-300 transition delay-100 duration-300 items-center"
            >
              <Image
                src="/icono-usuario.png"
                alt="Logo de TextilPluss"
                width={25}
                height={40}
                priority
              />
              <h2>Usuarios</h2>
            </Link>
          ) : null}

          <Link
            href={"/"}
            className=" w-full rounded-lg flex justify-start gap-2 p-2 hover:bg-blue-300 transition delay-100 duration-300 items-center"
          >
            <Image
              src="/categoria-icon.png"
              alt="Logo de TextilPluss"
              width={25}
              height={40}
              priority
            />
            <h2>Categoria</h2>
          </Link>

          <Link
            href={"/dashboard/productos"}
            className=" w-full rounded-lg flex justify-start gap-2 p-2 hover:bg-blue-300 transition delay-100 duration-300 items-center"
          >
            <Image
              src="/productos-icon.png"
              alt="Logo de TextilPluss"
              width={25}
              height={40}
              priority
            />
            <h2>Productos</h2>
          </Link>

          <Link
            href={"/"}
            className=" w-full rounded-lg flex justify-start gap-2 p-2 hover:bg-blue-300 transition delay-100 duration-300 items-center"
          >
            <Image
              src="/stock-icon.png"
              alt="Logo de TextilPluss"
              width={25}
              height={40}
              priority
            />
            <h2>Stock</h2>
          </Link>

          <Link
            href={"/"}
            className=" w-full rounded-lg flex justify-start gap-2 p-2 hover:bg-blue-300 transition delay-100 duration-300 items-center"
          >
            <Image
              src="/movimiento-icon.png"
              alt="Logo de TextilPluss"
              width={25}
              height={40}
              priority
            />
            <h2>Movimiento</h2>
          </Link>
        </div>
        <div className=" flex flex-col mt-auto gap-3">
          <h2>Usuario: {user.Usuario}</h2>
          <h2>Rol: {user.role}</h2>
          <Btnsalir />
        </div>
      </div>
    </div>
  );
}
