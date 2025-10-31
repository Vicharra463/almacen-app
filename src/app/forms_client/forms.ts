"use client";

import { FormEvent } from "react";
import { StockUbicacion } from "../assets/tipos";
import { promise } from "zod";
import { error } from "console";
import {UbicacionesResponse} from "../assets/tipos"
import {StockUbicacionesResponse} from "../assets/tipos"

export async function login(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget;
  const formdata = new FormData(form);

  const users = formdata.get("usuario") as string;
  const password = formdata.get("password") as string;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ users, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Error al iniciar sesión");
  }

  return res.json();
}

export async function getstockcircle(): Promise<StockUbicacion[]> {
    const res = await fetch("/api/empleado/stock");
    if(!res.ok) throw new Error(`error en la peticion ${res.status}`);
    const data = (await res.json()) as StockUbicacion[];
    return data;
}

export async function getstockmovimientos(): Promise<UbicacionesResponse> {
    const res = await fetch("/api/empleado/stock/movimientos");
    if(!res.ok) throw new Error(`error en la peticion ${res.status}`);
    const data = (await res.json()) as UbicacionesResponse;
    return data;
}


export async function getproductos(): Promise<StockUbicacionesResponse> {
  const res = await fetch("/api/empleado/stock/ubicaciones");
  if (!res.ok) throw new Error(`Error en la petición ${res.status}`);
  return (await res.json()) as StockUbicacionesResponse;
}

