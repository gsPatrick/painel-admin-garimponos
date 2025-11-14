// src/app/send/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Importa os componentes para cada passo do fluxo
import Step1_Upload from './_components/Step1_Upload';
import Step2_AddSigners from './_components/Step2_AddSigners';
import Step3_Configure from './_components/Step3_Configure';
import Step4_Send from './_components/Step4_Send';
import Step5_SendSuccess from './_components/Step5_SendSuccess'; // Tela de sucesso

// Importa componentes de UI
import { Button } from '@/components/ui/button';

// Define os passos do fluxo para o header
const STEPS = [
  { number: 1, label: "Adicionar Documentos" },
  { number: 2, label: "Adicionar signatários" },
  { number: 3, label: "Configuração" },
  { number: 4, label: "Enviar" },
  { number: 5, label: "Concluído" }, // Passo final para a tela de sucesso
];

/**
 * Página principal que gerencia o fluxo de envio de documentos para assinatura.
 * Atua como um "wizard", controlando o estado e renderizando o componente do passo atual.
 */
export default function SendDocumentFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  // Estado centralizado que armazena os dados coletados em cada etapa
  const [document, setDocument] = useState(null);
  const [signers, setSigners] = useState([]);
  const [config, setConfig] = useState({
    deadlineAt: new Date(new Date().setDate(new Date().getDate() + 7)), // Data limite padrão: 7 dias
    autoReminders: false,
    readConfirmation: false,
  });

  // Funções de navegação
  const goToNextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const goToPrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleCancel = () => router.push('/dashboard');

  // Função para ser chamada pelo Step4 quando o envio for bem-sucedido
  const handleSendSuccess = () => {
    setCurrentStep(5); // Muda para a etapa da tela de sucesso
  };

  /**
   * Renderiza o componente correspondente ao passo atual.
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1_Upload 
                 onNext={goToNextStep} 
                 onDocumentUploaded={setDocument} 
                 onCancel={handleCancel} 
               />;
      case 2:
        return <Step2_AddSigners 
                 onNext={goToNextStep} 
                 onBack={goToPrevStep} 
                 signers={signers} 
                 setSigners={setSigners} 
               />;
      case 3:
        return <Step3_Configure 
                 onNext={goToNextStep} 
                 onBack={goToPrevStep} 
                 config={config} 
                 setConfig={setConfig} 
               />;
      case 4:
        return <Step4_Send 
                 document={document} 
                 signers={signers} 
                 config={config} 
                 onBack={goToPrevStep}
                 onSuccess={handleSendSuccess} 
               />;
      case 5:
        return <Step5_SendSuccess />;
      default:
        return null;
    }
  };

  /**
   * Constrói o header com o logo e os indicadores de passo (stepper).
   */
  const headerContent = (
    <div className="flex items-center gap-4 sm:gap-8">
        {/* Logo visível em telas maiores */}
        <div className="hidden sm:block">
            <Image src="/logo.png" alt="Doculink Logo" width={140} height={32} />
        </div>

        {/* Indicadores de passo */}
        <div className="flex items-center gap-2 sm:gap-4">
            {STEPS.map(step => (
              // Não renderiza o passo "Concluído" no stepper
              step.number <= 4 && (
                <div key={step.number} className={`flex items-center gap-2 text-sm ${currentStep >= step.number ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                    <div className={`flex items-center justify-center size-6 rounded-full transition-colors ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step.number}
                    </div>
                    {/* Oculta o texto em telas pequenas para economizar espaço */}
                    <span className="hidden md:inline">{step.label}</span>
                </div>
              )
            ))}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* Header Fixo do Fluxo */}
      <header className="flex h-[68px] items-center justify-between bg-white px-4 sm:px-6 border-b shrink-0">
        {headerContent}
        <Button variant="outline" onClick={() => router.push('/dashboard')}>Sair</Button>
      </header>

      {/* Conteúdo Principal (onde os passos são renderizados) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-3xl">
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
}