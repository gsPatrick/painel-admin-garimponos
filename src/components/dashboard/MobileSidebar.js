// src/components/dashboard/MobileSidebar.js
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

// Importa o componente de navegação compartilhado
import Navigation from "./Navigation";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* Este botão só é visível em telas pequenas por causa do 'lg:hidden' */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[260px] flex flex-col">
        {/* --- CORREÇÃO APLICADA AQUI --- */}
        <div className="p-4 border-b">
          <Link href="/dashboard">
            {/* O Image dentro do Link é seguro */}
            <Image src="/logo.png" alt="Logo Doculink" width={140} height={32} />
          </Link>
        </div>
        
        {/* A navegação agora vem do componente compartilhado */}
        <div className="flex-grow p-4">
            <Navigation />
        </div>
        {/* Não há necessidade da seção de perfil aqui, pois a sidebar mobile é focada em navegação */}
      </SheetContent>
    </Sheet>
  );
}