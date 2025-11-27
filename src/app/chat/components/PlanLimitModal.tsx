'use client';

import { X, Crown, MessageSquare, Image as ImageIcon, Flame, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlanLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'messages' | 'characters' | 'scenes' | 'photos' | 'hot_mode';
}

const limitMessages = {
  messages: {
    title: 'Limite de Mensagens Atingido',
    description: 'Você atingiu o limite de 20 mensagens diárias do plano gratuito.',
    icon: MessageSquare,
    color: 'purple'
  },
  characters: {
    title: 'Múltiplos Personagens',
    description: 'O plano gratuito permite apenas 1 personagem. Desbloqueie mais com o Premium!',
    icon: Crown,
    color: 'pink'
  },
  scenes: {
    title: 'Cenas Longas Bloqueadas',
    description: 'Cenas longas e detalhadas estão disponíveis apenas no plano Premium.',
    icon: Zap,
    color: 'cyan'
  },
  photos: {
    title: 'Fotos Bloqueadas',
    description: 'Receba fotos sensuais da sua IA apenas no plano Premium.',
    icon: ImageIcon,
    color: 'orange'
  },
  hot_mode: {
    title: 'Modo Quente Bloqueado',
    description: 'O modo mais intenso está disponível apenas para assinantes Premium.',
    icon: Flame,
    color: 'red'
  }
};

const plans = [
  {
    name: 'Plano Premium',
    price: 'R$ 19,90',
    period: '/mês',
    features: [
      'Mensagens ilimitadas',
      'Até 5 personagens diferentes',
      'Cenas longas e detalhadas',
      'Fotos sensuais da IA',
      'Modo Quente desbloqueado',
      'Prioridade nas respostas',
      'Sem anúncios'
    ],
    gradient: 'from-purple-600 to-pink-600',
    popular: true
  },
  {
    name: 'Plano Anual',
    price: 'R$ 169,90',
    period: '/ano',
    savings: 'Economize R$ 68,90',
    features: [
      'Tudo do plano mensal',
      '2 meses grátis',
      'Acesso antecipado a novos recursos',
      'Suporte prioritário VIP',
      'Personagens exclusivos',
      'Modo Ultra Quente',
      'Backup de conversas'
    ],
    gradient: 'from-orange-500 to-red-600',
    popular: false
  }
];

export default function PlanLimitModal({ isOpen, onClose, limitType }: PlanLimitModalProps) {
  if (!isOpen) return null;

  const limit = limitMessages[limitType];
  const Icon = limit.icon;

  const colorClasses = {
    purple: 'text-purple-400 bg-purple-500/20',
    pink: 'text-pink-400 bg-pink-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/20',
    orange: 'text-orange-400 bg-orange-500/20',
    red: 'text-red-400 bg-red-500/20'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-2 border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${colorClasses[limit.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{limit.title}</h2>
                <p className="text-white/70">{limit.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white/70" />
            </button>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`bg-gradient-to-br ${plan.gradient} border-4 ${
                  plan.popular ? 'border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.4)]' : 'border-white/20'
                } p-6 relative overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold">
                    MAIS POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/70">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2 inline-block px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-white">
                      <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full py-6 text-lg bg-white text-black hover:bg-white/90 font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300"
                  onClick={() => {
                    // Aqui você implementaria a lógica de pagamento
                    alert('Redirecionando para pagamento...');
                  }}
                >
                  Assinar Agora
                </Button>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-white/60 text-sm">
            <p>✨ Cancele quando quiser • Pagamento 100% seguro • Suporte 24/7</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
