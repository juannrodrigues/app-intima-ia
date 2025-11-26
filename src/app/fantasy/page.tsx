'use client';

import { useState } from 'react';
import { Sparkles, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Scenario = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

type StorySegment = {
  text: string;
  choices?: string[];
};

const scenarios: Scenario[] = [
  {
    id: 'car',
    title: 'Encontro no Carro',
    description: 'Uma noite inesquecível em um lugar privado e íntimo',
    emoji: '🚗'
  },
  {
    id: 'hotel',
    title: 'Noite no Hotel',
    description: 'Um quarto luxuoso, champanhe e muita química',
    emoji: '🏨'
  },
  {
    id: 'distance',
    title: 'À Distância',
    description: 'Conexão intensa através de mensagens e chamadas',
    emoji: '📱'
  },
  {
    id: 'beach',
    title: 'Praia ao Luar',
    description: 'Areia, ondas e uma conexão sob as estrelas',
    emoji: '🌊'
  },
  {
    id: 'home',
    title: 'Em Casa',
    description: 'Intimidade no conforto do lar, sem pressa',
    emoji: '🏠'
  },
  {
    id: 'surprise',
    title: 'Encontro Surpresa',
    description: 'Um encontro inesperado que muda tudo',
    emoji: '✨'
  }
];

export default function FantasyPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [story, setStory] = useState<StorySegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium] = useState(false); // Simular plano free
  const [scenesUsed, setScenesUsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleScenarioSelect = async (scenarioId: string) => {
    if (!isPremium && scenesUsed >= 1) {
      alert('Você atingiu o limite do plano gratuito. Faça upgrade para Premium e desbloqueie cenas ilimitadas! 🔥');
      return;
    }

    setSelectedScenario(scenarioId);
    setIsLoading(true);
    setStory([]);
    setError(null);

    try {
      console.log('📤 Gerando história para cenário:', scenarioId);
      
      const response = await fetch('/api/generate-fantasy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenarioId,
          isPremium,
          isFirstSegment: true
        })
      });

      const data = await response.json();
      
      console.log('📥 Resposta recebida:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erro ao gerar história');
      }
      
      if (data.story) {
        setStory([data.story]);
        setScenesUsed(prev => prev + 1);
        console.log('✅ História gerada com sucesso!');
      } else {
        throw new Error('História não foi gerada corretamente');
      }
    } catch (error: any) {
      console.error('❌ Erro ao gerar história:', error);
      const errorMessage = error.message || 'Erro ao gerar história. Tente novamente.';
      setError(errorMessage);
      
      if (errorMessage.includes('API Key')) {
        alert('⚠️ Configure sua API Key da OpenAI para usar esta funcionalidade.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: string) => {
    if (!isPremium) {
      alert('Esta é uma funcionalidade Premium! Faça upgrade para continuar a história. 🔥');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📤 Continuando história com escolha:', choice);
      
      const response = await fetch('/api/generate-fantasy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenarioId: selectedScenario,
          previousStory: story.map(s => s.text).join('\n'),
          choice,
          isPremium,
          isFirstSegment: false
        })
      });

      const data = await response.json();
      
      console.log('📥 Continuação recebida:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erro ao continuar história');
      }
      
      if (data.story) {
        setStory(prev => [...prev, data.story]);
        console.log('✅ História continuada com sucesso!');
      } else {
        throw new Error('Continuação não foi gerada corretamente');
      }
    } catch (error: any) {
      console.error('❌ Erro ao continuar história:', error);
      const errorMessage = error.message || 'Erro ao continuar história. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetStory = () => {
    setSelectedScenario(null);
    setStory([]);
    setError(null);
  };

  if (selectedScenario && story.length > 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={resetStory}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar aos cenários
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-300 mb-1">Erro ao gerar história</h3>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
            {story.map((segment, index) => (
              <div key={index} className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {segment.text}
                  </p>
                </div>

                {segment.choices && segment.choices.length > 0 && index === story.length - 1 && (
                  <div className="space-y-3 pt-4">
                    <p className="text-sm font-medium text-white/60">
                      O que você faz?
                    </p>
                    {segment.choices.map((choice, choiceIndex) => (
                      <button
                        key={choiceIndex}
                        onClick={() => handleChoice(choice)}
                        disabled={isLoading}
                        className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] text-white hover:shadow-[0_0_20px_rgba(155,77,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {choice}
                      </button>
                    ))}
                    
                    {!isPremium && (
                      <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                        <Lock className="w-4 h-4" />
                        <span>Faça upgrade para Premium e continue a história!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9B4DFF]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#9B4DFF] to-[#6A0DAD] rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#9B4DFF] to-[#FF6B9D] bg-clip-text text-transparent mb-4">
            Modo Fantasia
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore cenários íntimos e interativos criados especialmente para você. 
            Cada escolha molda sua história única e envolvente.
          </p>
          
          {!isPremium && (
            <div className="mt-6 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-full text-sm">
              <Lock className="w-4 h-4" />
              <span>Plano Free: 1 cena curta • Premium: Cenas ilimitadas e completas</span>
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-300 mb-1">Erro</h3>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario.id)}
              disabled={isLoading || (!isPremium && scenesUsed >= 1)}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-[0_0_30px_rgba(155,77,255,0.3)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-left"
            >
              <div className="text-5xl mb-4">{scenario.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {scenario.title}
              </h3>
              <p className="text-white/60 text-sm">
                {scenario.description}
              </p>
              
              {!isPremium && scenesUsed >= 1 && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Premium</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-[#9B4DFF]/0 to-[#6A0DAD]/0 group-hover:from-[#9B4DFF]/10 group-hover:to-[#6A0DAD]/10 rounded-2xl transition-all duration-300"></div>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B4DFF] mx-auto mb-4"></div>
              <p className="text-white">Criando sua história...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
