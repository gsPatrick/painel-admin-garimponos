"use client"; // Precisa ser um Client Component para usar o usePathname

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // Pega o caminho da URL atual

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/*
          --- CORREÇÃO CRUCIAL ---
          Adicionando uma 'key' única ao container do children.
          Quando o usuário navega de /documentos/pendentes para /documentos/todos,
          o 'pathname' muda, forçando o React a desmontar o componente antigo
          e montar um novo, garantindo que o estado e os useEffects rodem do zero.
        */}
        <div key={pathname}>
          {children}
        </div>
      </main>
    </div>
  );
}