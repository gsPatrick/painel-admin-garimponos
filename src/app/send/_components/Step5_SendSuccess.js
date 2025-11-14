// src/app/send/_components/Step5_SendSuccess.js
"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Step5_SendSuccess() {
  const router = useRouter();

  return (
    <Card className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-xl border-none p-8 text-center">
      <CardContent className="p-0 flex flex-col items-center gap-6">
        {/* Usando a imagem sucesso.png da pasta public */}
        <Image 
          src="/sucesso.png" // Caminho relativo à pasta /public
          alt="Ícone de Sucesso"
          width={80} // Ajuste o tamanho conforme necessário
          height={80}
        />
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[#151928]">
            Sucesso!
          </h2>
          <p className="text-muted-foreground">
            Seu documento será enviado para assinatura!
          </p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard')}
          className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90 mt-4"
        >
          Ir para o dashboard
        </Button>
      </CardContent>
    </Card>
  );
}