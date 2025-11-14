// src/app/sign/[token]/_components/Step5_Success.js
"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importa o componente Image
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Step5_Success() {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl border-none p-8 text-center">
      <CardContent className="p-0 flex flex-col items-center gap-6">
        
        {/* --- CORREÇÃO: USANDO SUA IMAGEM --- */}
        <Image 
          src="/sucesso.png" 
          alt="Ícone de Sucesso"
          width={80}
          height={80}
        />
        {/* ------------------------------------ */}

        <h2 className="text-3xl font-bold text-[#151928]">
          Sua assinatura foi registrada com sucesso!
        </h2>
        
        <div className="flex gap-4">
            <Button variant="outline" onClick={() => alert('Funcionalidade a ser implementada')}>
              Conheça Mais
            </Button>
            <Button 
              onClick={() => router.push('/dashboard')} // Redireciona para o dashboard se o usuário tiver conta
              className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90"
            >
              Acessar Minha Conta
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}