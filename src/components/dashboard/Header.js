// src/components/dashboard/Header.js
"use client";

import { useRouter } from 'next/navigation'; // Importa o hook de navegação
import { Button } from "@/components/ui/button";
import MobileSidebar from "./MobileSidebar";

export default function Header({ leftContent, actionButtonText }) {
  const router = useRouter(); // Inicializa o hook

  // Função que será chamada pelo botão de ação
  const handleActionButtonClick = () => {
    // Se o texto for "Enviar Documento", navega para a página /send
    if (actionButtonText === "Enviar Documento") {
      router.push('/send');
    }
    // Você pode adicionar outras lógicas aqui para outros botões no futuro
  };

  return (
    <header className="flex h-[68px] items-center justify-between bg-white px-4 sm:px-6 border-b">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <div>
          {leftContent}
        </div>
      </div>
      <div>
        {actionButtonText && (
          <Button
            onClick={handleActionButtonClick} // Usa a nova função de navegação
            className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90 text-white font-semibold rounded-lg"
          >
            {actionButtonText}
          </Button>
        )}
      </div>
    </header>
  );
}