'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { Card } from '@/components/custom/Card';
import {
  ChevronLeft,
  Check,
  Crown,
  Zap,
  Heart,
  Sparkles,
  MessageSquare,
  Users,
  Shield,
  Star,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    icon: <Zap className="w-6 h-6" />,
    features: [
      '20 mensagens por dia',
      'Acesso a 3 personagens',
      '1 cena de fantasia',
      'Suporte básico',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.90,
    interval: 'month',
    stripePriceId: 'price_premium_monthly', // Substituir pelo ID real do Stripe
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    features: [
      'Mensagens ilimitadas',
      'Todos os personagens disponíveis',
      'Cenas de fantasia ilimitadas',
      'Modo voz (TTS/STT)',
      'Análise de sentimento',
      'Suporte prioritário',
      'Sem anúncios',
      'Backup de conversas',
    ],
  },
  {
    id: 'premium_yearly',
    name: 'Premium Anual',
    price: 199.90,
    interval: 'year',
    stripePriceId: 'price_premium_yearly', // Substituir pelo ID real do Stripe
    icon: <Star className="w-6 h-6" />,
    features: [
      'Tudo do Premium mensal',
      '2 meses grátis',
      'Acesso antecipado a novos recursos',
      'Suporte VIP',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === 'free') {
      router.push('/dashboard');
      return;
    }

    setLoading(plan.id);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId: 'user_demo_123', // Em produção, pegar do auth
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }
    } catch (error: any) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Planos</h1>
              <p className="text-sm text-white/60">
                Escolha o plano ideal para você
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#9B4DFF] to-[#6A0DAD] rounded-2xl mb-6 shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9B4DFF] to-[#FF6B9D] bg-clip-text text-transparent mb-4">
            Desbloqueie Todo o Potencial
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Tenha acesso ilimitado a todos os recursos premium e transforme suas conversas em experiências inesquecíveis.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.popular
                  ? 'bg-gradient-to-br from-[#9B4DFF]/20 to-[#6A0DAD]/20 border-[#9B4DFF] scale-105'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  plan.popular ? 'bg-[#9B4DFF]/20' : 'bg-white/10'
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-1">
                  R$ {plan.price.toFixed(2)}
                  <span className="text-lg text-white/60">
                    /{plan.interval === 'month' ? 'mês' : 'ano'}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD]' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? 'Processando...' : plan.id === 'free' ? 'Continuar Gratuito' : 'Assinar Agora'}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-white/60 text-sm">
                Sim, você pode cancelar sua assinatura a qualquer momento. O acesso premium continuará até o final do período pago.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <h3 className="font-semibold mb-2">Como funciona o reembolso?</h3>
              <p className="text-white/60 text-sm">
                Oferecemos reembolso total dentro de 30 dias após a compra, sem perguntas.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <h3 className="font-semibold mb-2">Posso mudar de plano?</h3>
              <p className="text-white/60 text-sm">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}