// src/app/sign/[token]/page.js
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';

// Importação dos componentes de passo (exceto o que será carregado dinamicamente)
import Step1_Summary from './_components/Step1_Summary';
import Step2_Identify from './_components/Step2_Identify';
import Step4_VerifyOtp from './_components/Step4_VerifyOtp';
import Step5_Success from './_components/Step5_Success';

// Importação do componente de UI para feedback de carregamento
import { Skeleton } from '@/components/ui/skeleton'; 

// Carregamento dinâmico do Step3 para evitar o erro de compatibilidade do 'react-pdf' com SSR
const Step3_DrawSign = dynamic(
  () => import('./_components/Step3_DrawSign'),
  { 
    ssr: false, // Essencial para corrigir o erro "Object.defineProperty"
    loading: () => ( // Componente de fallback exibido durante o carregamento
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <Skeleton className="h-96 w-full" />
      </div>
    )
  }
);

/**
 * Página principal que orquestra todo o fluxo de assinatura para o signatário.
 * Utiliza o token da URL para buscar e processar os dados do documento.
 */
export default function SignPage() {
  const params = useParams(); // Hook do Next.js para acessar parâmetros de rotas dinâmicas
  const token = params.token;
  
  // Estado para controlar o passo atual do fluxo (ex: 0 para carregar, 1 para resumo, etc.)
  const [currentStep, setCurrentStep] = useState(0); 
  const [error, setError] = useState('');
  
  // Estado para armazenar os dados coletados durante as etapas
  const [summaryData, setSummaryData] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null); // Armazena a imagem da assinatura em Base64

  // Efeito para buscar os dados iniciais da API ao carregar a página.
  useEffect(() => {
    // Se o token não estiver presente na URL, exibe um erro.
    if (!token) {
        setError("Token de assinatura inválido ou não fornecido.");
        setCurrentStep(-1);
        return;
    }

    const fetchInitialData = async () => {
      try {
        // Realiza uma única chamada à API para obter os dados do documento e do signatário.
        const response = await api.get(`/sign/${token}`);
        
        setSummaryData(response.data);
        
        // Se a chamada for bem-sucedida, avança para o primeiro passo do fluxo.
        setCurrentStep(1);
      } catch (err) {
        // Em caso de erro, define a mensagem e o estado de erro para exibição.
        setError(err.response?.data?.message || 'Link inválido, expirado ou ocorreu um erro inesperado.');
        setCurrentStep(-1);
      }
    };

    fetchInitialData();
  }, [token]); // O efeito é re-executado se o token na URL mudar.
  
  // Funções de navegação que são passadas para os componentes filhos
  const goToNextStep = () => setCurrentStep(prev => prev + 1);
  const goToPrevStep = () => setCurrentStep(prev => prev - 1);

  /**
   * Renderiza o componente de passo apropriado com base no estado `currentStep`.
   */
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Estado de Carregamento
        return (
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                <Skeleton className="h-8 w-3/4 mb-6" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-end mt-8"><Skeleton className="h-10 w-24" /></div>
            </div>
        );
      
      case 1: // Passo 1: Resumo do Documento
        return <Step1_Summary data={summaryData} onNext={goToNextStep} />;
      
      case 2: // Passo 2: Identificação do Signatário
        return <Step2_Identify token={token} onNext={goToNextStep} onBack={goToPrevStep} summaryData={summaryData} />;
      
      case 3: // Passo 3: Captura da Assinatura (Componente Dinâmico)
        return <Step3_DrawSign onNext={goToNextStep} onBack={goToPrevStep} onSigned={setSignatureImage} />;
      
      case 4: // Passo 4: Verificação com Código OTP
        return <Step4_VerifyOtp token={token} signatureImage={signatureImage} onNext={goToNextStep} onBack={goToPrevStep} />;
      
      case 5: // Passo 5: Tela de Sucesso
        return <Step5_Success />;
      
      case -1: // Estado de Erro
        return (
          <div className="w-full max-w-lg text-center bg-white p-10 rounded-lg shadow-lg border border-red-200">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Acesso Negado</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col min-h-screen w-full items-center justify-center bg-[#f1f5f9] p-4">
        {/* --- LOGO ADICIONADA AQUI --- */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
            <Image 
                src="/logo.png" 
                alt="Logo Doculink" 
                width={140} 
                height={32}
                priority // Ajuda a carregar a logo mais rápido
            />
        </div>
        {/* ----------------------------- */}
        
        {/* Container que centraliza e define a largura máxima para o conteúdo de cada passo */}
      <div className="w-full max-w-3xl px-4">
        {renderStep()}
      </div>
    </main>
  );
}