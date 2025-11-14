
// src/app/sign/[token]/_components/stepComponents.js
import dynamic from 'next/dynamic';
import Step1_Summary from './Step1_Summary';
import Step2_Identify from './Step2_Identify';
import Step4_VerifyOtp from './Step4_VerifyOtp';
import Step5_Success from './Step5_Success';
import { Skeleton } from '@/components/ui/skeleton';
// Carrega o Step3 com ssr: false
const Step3_DrawSign = dynamic(
() => import('./Step3_DrawSign'),
{
ssr: false,
loading: () => (
<div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
<Skeleton className="h-8 w-1/2 mb-4" />
<Skeleton className="h-96 w-full" />
</div>
)
}
);
// Mapeia o número do passo para o componente correspondente
export const stepComponents = {
1: Step1_Summary,
2: Step2_Identify,
3: Step3_DrawSign,
4: Step4_VerifyOtp,
5: Step5_Success,
};