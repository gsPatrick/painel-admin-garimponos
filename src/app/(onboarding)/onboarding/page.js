// src/app/onboarding/page.js
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Importa o hook de autenticação

// Importação dos componentes de UI e ícones
import { Signature, FileTextIcon } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Importa o Skeleton para o estado de loading

export default function OnboardingPage() {
  // Obtém o usuário logado e o estado de carregamento do AuthContext
  const { user, loading } = useAuth();

  // Exibe um esqueleto de UI enquanto o AuthContext está validando/buscando os dados do usuário
  if (loading) {
    return (
      <Card className="w-full max-w-lg bg-white shadow-lg rounded-xl border-none p-8">
        <CardHeader className="p-0">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="p-0 mt-8 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Pega o nome do usuário do contexto, com um fallback caso não esteja disponível
  const userName = user?.name || "Usuário";

  return (
    <Card className="w-full max-w-lg bg-white shadow-lg rounded-xl border-none p-8">
      <CardHeader className="p-0">
        <CardTitle className="text-3xl font-bold text-[#151928]">
          Olá, {userName}
        </CardTitle>
        <CardDescription className="text-base pt-1">
          O que deseja fazer hoje?
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 mt-8 space-y-4">
        {/* Bloco 1: Ir para a Página Principal */}
        <Link href="/dashboard" className="block w-full text-left">
          <div className="flex w-full items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <Signature className="size-5 text-muted-foreground" />
            <span className="font-medium text-[#151928]">
              Ir para a Página Principal
            </span>
          </div>
        </Link>

        {/* Bloco 2: Enviar Documentos */}
        {/* CORREÇÃO: O link deve apontar para '/send', a rota do nosso fluxo de envio */}
        <Link href="/send" className="block w-full text-left">
          <div className="flex w-full flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-4">
              <FileTextIcon className="size-5 text-muted-foreground" />
              <span className="font-medium text-[#151928]">
                Enviar documentos para assinatura
              </span>
            </div>
            
            <div className="pl-9 space-y-4"> {/* Adicionado padding para alinhar com o texto */}
              <p className="text-sm text-muted-foreground leading-snug">
                Acesse a área de envio para enviar documentos para assinatura.
              </p>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#151928]">Firmar como:</p>
                <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/50 p-6">
                  <Image
                    src="/logo.png"
                    alt="Logo Doculink"
                    width={160}
                    height={40}
                    className="object-contain"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700"
                    // Evita que o clique no botão ative o link do card pai
                    onClick={(e) => e.preventDefault()} 
                  >
                    {userName}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}