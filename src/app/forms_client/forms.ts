"use client";

import { FormEvent } from "react";

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
