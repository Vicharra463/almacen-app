import { error } from "console";
import { FormEvent, FormEventHandler } from "react";

export async function login(e : FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //hace referencia al formulario completo
    const form = e.currentTarget;
    //hace referencia al los datos de este formulario
    const formdata= new FormData(form)

    const users = formdata.get("usuario") as string
 
    const password = formdata.get("password") as string

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({users,password}),
    })

    if(!res.ok){
        const errorData = await res.json();
        throw new Error(errorData || "error iniciar secion");
    }

    return res.json();
}