'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { ChevronRight, ChevronLeft, Sparkles, MessageCircle, Shield } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Sparkles,
    title: 'Bem-vindo ao Intima IA',
    description: 'Sua assistente de relacionamentos com inteligência artificial avançada',
    features: ['Conversas naturais e envolventes', 'Análise de mensagens em tempo real', 'Sugestões personalizadas'],
  },
  {
    icon: MessageCircle,
    title: 'Conversas Inteligentes',
    description: 'Receba sugestões de mensagens perfeitas para cada momento',
    features: ['Respostas criativas', 'Análise de tom e contexto', 'Mensagens prontas personalizadas'],
  },
  {
    icon: Shield,
    title: 'Privacidade Total',
    description: 'Suas conversas são 100% privadas e criptografadas',
    features: ['Criptografia de ponta a ponta', 'Dados nunca compartilhados', 'Controle total sobre suas informações'],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/login');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        {currentStep > 0 ? (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        <button
          onClick={handleSkip}
          className="text-white/60 hover:text-white transition-colors text-sm font-medium"
        >
          Pular
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] blur-3xl opacity-50 rounded-full" />
          <div className="relative bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] p-8 rounded-full">
            <Icon className="w-16 h-16" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] bg-clip-text text-transparent">
          {step.title}
        </h1>

        {/* Description */}
        <p className="text-white/70 text-center text-lg mb-8 max-w-md">
          {step.description}
        </p>

        {/* Features */}
        <div className="space-y-3 w-full max-w-md mb-12">
          {step.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD]" />
              <span className="text-white/90">{feature}</span>
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD]'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button onClick={handleNext} fullWidth className="max-w-md">
          <span className="flex items-center justify-center gap-2">
            {currentStep < onboardingSteps.length - 1 ? 'Continuar' : 'Começar'}
            <ChevronRight className="w-5 h-5" />
          </span>
        </Button>
      </div>
    </div>
  );
}
