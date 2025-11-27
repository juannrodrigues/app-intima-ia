'use client';

import { Heart, Flame, Crown, Moon, Sparkles, Lock, Zap, Star, Wind, Droplet, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type AIProfile = 'romantic' | 'bold' | 'dominant' | 'shy' | 'mysterious' | 'playful' | 'sensual' | 'wild';

interface ProfileOption {
  id: AIProfile;
  name: string;
  description: string;
  icon: any;
  gradient: string;
  borderColor: string;
  shadowColor: string;
  locked?: boolean;
}

const profiles: ProfileOption[] = [
  {
    id: 'romantic',
    name: 'Romântica',
    description: 'Carinhosa, apaixonada e doce. Perfeita para conversas íntimas e momentos especiais.',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-400',
    shadowColor: 'shadow-[0_0_30px_rgba(236,72,153,0.6)]'
  },
  {
    id: 'bold',
    name: 'Ousada',
    description: 'Confiante, provocante e divertida. Para quem gosta de conversas mais intensas.',
    icon: Flame,
    gradient: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-400',
    shadowColor: 'shadow-[0_0_30px_rgba(249,115,22,0.6)]'
  },
  {
    id: 'dominant',
    name: 'Dominante',
    description: 'Assertiva, no controle e sedutora. Toma a iniciativa e comanda a conversa.',
    icon: Crown,
    gradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]'
  },
  {
    id: 'shy',
    name: 'Tímida',
    description: 'Delicada, reservada e meiga. Perfeita para quem prefere algo mais suave.',
    icon: Moon,
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-400',
    shadowColor: 'shadow-[0_0_30px_rgba(34,211,238,0.6)]'
  },
  {
    id: 'mysterious',
    name: 'Misteriosa',
    description: 'Enigmática e intrigante. Cada conversa é uma descoberta cheia de surpresas.',
    icon: Star,
    gradient: 'from-violet-500 to-purple-700',
    borderColor: 'border-violet-400',
    shadowColor: 'shadow-[0_0_30px_rgba(139,92,246,0.6)]',
    locked: true
  },
  {
    id: 'playful',
    name: 'Brincalhona',
    description: 'Divertida, espontânea e cheia de energia. Transforma cada momento em diversão.',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-600',
    borderColor: 'border-yellow-400',
    shadowColor: 'shadow-[0_0_30px_rgba(234,179,8,0.6)]',
    locked: true
  },
  {
    id: 'sensual',
    name: 'Sensual',
    description: 'Sofisticada e provocante. Sabe exatamente como despertar seus sentidos.',
    icon: Droplet,
    gradient: 'from-red-500 to-pink-600',
    borderColor: 'border-red-400',
    shadowColor: 'shadow-[0_0_30px_rgba(239,68,68,0.6)]',
    locked: true
  },
  {
    id: 'wild',
    name: 'Selvagem',
    description: 'Intensa, imprevisível e sem limites. Para quem busca experiências extremas.',
    icon: Wind,
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
    shadowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
    locked: true
  }
];

interface ProfileSelectorProps {
  onSelect: (profile: AIProfile) => void;
  selectedProfile?: AIProfile;
  onShowPlans?: () => void;
}

export default function ProfileSelector({ onSelect, selectedProfile, onShowPlans }: ProfileSelectorProps) {
  const router = useRouter();
  const [localSelectedProfile, setLocalSelectedProfile] = useState<AIProfile | null>(selectedProfile || null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const handleProfileClick = (profile: ProfileOption) => {
    if (profile.locked) {
      // Mostrar modal de planos quando clicar em perfil bloqueado
      setShowPlanModal(true);
      return;
    }
    // Apenas seleciona o perfil, não inicia o chat
    setLocalSelectedProfile(profile.id);
  };

  const handleStartChat = () => {
    if (localSelectedProfile) {
      onSelect(localSelectedProfile);
    }
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white flex items-center justify-center p-4 relative">
      {/* Botão de Fechar */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] z-50"
        title="Voltar ao Dashboard"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-400 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            <h1 
              className="text-4xl md:text-5xl font-bold text-white"
              style={{
                textShadow: '0 0 10px rgba(168,85,247,0.8), 0 0 20px rgba(236,72,153,0.6), 0 0 30px rgba(34,211,238,0.4)'
              }}
            >
              Escolha seu Perfil de IA
            </h1>
            <Sparkles className="w-10 h-10 text-pink-400 animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
          </div>
          <p 
            className="text-white text-lg md:text-xl font-medium"
            style={{
              textShadow: '0 0 8px rgba(255,255,255,0.5), 0 0 15px rgba(168,85,247,0.4)'
            }}
          >
            Selecione a personalidade que mais combina com você
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            const isSelected = localSelectedProfile === profile.id;
            const isLocked = profile.locked;
            
            return (
              <Card
                key={profile.id}
                className={`bg-white/5 border-4 p-6 cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                  isSelected
                    ? `${profile.borderColor} ${profile.shadowColor}`
                    : isLocked
                    ? 'border-white/20 hover:border-white/40 opacity-75'
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => handleProfileClick(profile)}
              >
                {isLocked && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-2 shadow-[0_0_20px_rgba(234,179,8,0.8)]">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${profile.gradient} flex items-center justify-center ${profile.shadowColor} ${isLocked ? 'opacity-60' : ''}`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 
                      className="text-2xl font-bold mb-2 text-white"
                      style={{
                        textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 15px rgba(168,85,247,0.5)'
                      }}
                    >
                      {profile.name}
                    </h3>
                    <p 
                      className="text-white text-sm font-medium"
                      style={{
                        textShadow: '0 0 5px rgba(255,255,255,0.4)'
                      }}
                    >
                      {profile.description}
                    </p>
                  </div>

                  {isSelected && !isLocked && (
                    <div className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                      ✓ Selecionado
                    </div>
                  )}

                  {isLocked && (
                    <div className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-sm font-bold shadow-[0_0_20px_rgba(234,179,8,0.8)]">
                      🔒 Premium
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {localSelectedProfile && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleStartChat}
              className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] transition-all duration-300 text-white hover:scale-105"
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.8)'
              }}
            >
              Começar Conversa 💬
            </Button>
          </div>
        )}

        {/* Modal de Planos */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-2 border-purple-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(168,85,247,0.5)]">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="text-3xl font-bold text-white mb-2"
                  style={{
                    textShadow: '0 0 10px rgba(168,85,247,0.8), 0 0 20px rgba(236,72,153,0.6)'
                  }}
                >
                  Perfil Premium 💎
                </h2>
                <p className="text-white/80 text-lg">
                  Este perfil está disponível apenas para assinantes
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Plano Mensal */}
                <div className="bg-white/5 border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">Plano Mensal</h3>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      R$ 29,90
                    </div>
                    <p className="text-white/60 text-sm">por mês</p>
                  </div>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>✓ Todos os 8 perfis desbloqueados</li>
                    <li>✓ Mensagens ilimitadas</li>
                    <li>✓ Modo quente liberado</li>
                    <li>✓ Cenas longas</li>
                    <li>✓ Fotos exclusivas</li>
                  </ul>
                </div>

                {/* Plano Anual */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)]">
                    MELHOR OFERTA
                  </div>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">Plano Anual</h3>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      R$ 19,90
                    </div>
                    <p className="text-white/60 text-sm">por mês (R$ 238,80/ano)</p>
                    <p className="text-green-400 text-xs font-semibold mt-1">Economize 33%</p>
                  </div>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>✓ Todos os 8 perfis desbloqueados</li>
                    <li>✓ Mensagens ilimitadas</li>
                    <li>✓ Modo quente liberado</li>
                    <li>✓ Cenas longas</li>
                    <li>✓ Fotos exclusivas</li>
                    <li className="text-yellow-400 font-semibold">✓ 4 dias de trial grátis</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/60 text-sm mb-4">
                  🎁 Experimente grátis por 4 dias com o plano anual!
                </p>
                <Button
                  onClick={() => setShowPlanModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300 text-white font-semibold"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
