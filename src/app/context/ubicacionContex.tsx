"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { StockUbicacion } from "../assets/tipos";
import { getstockcircle } from "../forms_client/forms";
export type stockubicacion_contex = {
  stock: StockUbicacion[] | null;
  setstock: Dispatch<SetStateAction<StockUbicacion[] | null>>;
  loading: boolean;
  error: string | null;
};

const ubicacionContext = createContext<stockubicacion_contex | undefined>(
  undefined
);

export function StockUbicacionProvider({ children }: { children: ReactNode }) {
  const [stock, setstock] = useState<StockUbicacion[] | null>(null);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<string | null>(null);

  useEffect(() => {
    const datastock = async () => {
      try {
        const data = await getstockcircle();
        setstock(data)
      } catch (e: any) {
         seterror(e?.message?? String(e))
      } finally {
        setloading(false)
      }
    };
    datastock();
  }, []);

  return (
    <ubicacionContext.Provider value={{ stock, setstock, loading, error }}>
      {children}
    </ubicacionContext.Provider>
  );
}

export function useStock(){
  const context = useContext(ubicacionContext)
    if (!context) {
    throw new Error("useCliente debe usarse dentro de ClienteProvider");
  }
  return context;
}