"use client";
import "../../app/globals.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Btnsalir() {
  const Router = useRouter()
  const salir = async () => {
    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      return { ok: true };
    }
    const res = await logout();
    if (res.ok) {
      Router.push("/")
    }
  };
  return (
    <button
      onClick={salir}
      className="mt-auto cursor-pointer flex rounded-md gap-2 text-black p-2 hover:bg-red-600/30"
    >
      <Image
        src="/icon-salida.png"
        alt="Logo de TextilPluss"
        width={25}
        height={40}
        priority
      />
      <h2>Cerrar sesión</h2>
    </button>
  );
}
