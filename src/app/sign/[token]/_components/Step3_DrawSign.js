// src/app/send/_components/Step3_DrawSign.js
"use client";

import { useRef, useEffect, useState } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// REMOVEMOS: react-pdf, react-draggable, e a chamada de API de posicionamento.

export default function Step3_DrawSign({ onNext, onBack, onSigned }) {
  const canvasRef = useRef(null);
  const [signaturePad, setSignaturePad] = useState(null);
  const [typedName, setTypedName] = useState('');
  const [activeTab, setActiveTab] = useState('draw');

  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        const pad = new SignaturePad(canvas, { backgroundColor: 'rgb(255, 255, 255)' });
        setSignaturePad(pad);
        return () => { pad.off(); };
    }
  }, [activeTab]);

  const generateTypedSignatureImage = (text) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400; tempCanvas.height = 100;
    const ctx = tempCanvas.getContext('2d');
    ctx.font = "40px 'Dancing Script'";
    ctx.fillStyle = 'black';
    ctx.fillText(text, 10, 60);
    return tempCanvas.toDataURL('image/png');
  };

  /**
   * Salva a assinatura e avança para o próximo passo.
   */
  const handleSaveAndContinue = () => {
    let dataUrl;
    if (activeTab === 'draw') {
      if (signaturePad && !signaturePad.isEmpty()) {
        dataUrl = signaturePad.toDataURL('image/png');
      } else {
        return alert("Por favor, desenhe sua assinatura.");
      }
    } else {
      if (typedName.trim()) {
        dataUrl = generateTypedSignatureImage(typedName);
      } else {
        return alert("Por favor, digite seu nome.");
      }
    }
    onSigned(dataUrl); // Passa a imagem para o componente pai
    onNext(); // Avança para o próximo passo (OTP)
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-xl border-none p-8">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-2xl font-bold text-[#151928]">Assinatura do documento</CardTitle>
        <p className="text-muted-foreground mt-1">Desenhe ou digite sua assinatura abaixo.</p>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="draw">Desenhar</TabsTrigger>
          <TabsTrigger value="type">Digitar</TabsTrigger>
        </TabsList>
        <TabsContent value="draw">
          <canvas ref={canvasRef} className="border rounded-lg w-full h-[192px]" />
        </TabsContent>
        <TabsContent value="type">
          <Input 
              value={typedName} 
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="h-12 text-2xl"
              style={{ fontFamily: "'Dancing Script', cursive" }}
          />
           <div className="mt-4 p-4 border rounded-lg h-36 flex items-center justify-center text-gray-700" style={{ fontFamily: "'Dancing Script', cursive", fontSize: '40px' }}>
              {typedName || 'Pré-visualização'}
          </div>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex justify-between items-center p-0 mt-6">
          <Button variant="ghost" onClick={() => signaturePad?.clear()}>Apagar</Button>
          <div className='space-x-4'>
            <Button variant="outline" onClick={onBack}>Anterior</Button>
            <Button onClick={handleSaveAndContinue} className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90">
              Próximo
            </Button>
          </div>
      </CardFooter>
    </Card>
  );
}