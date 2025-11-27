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
  X,
  TrendingDown,
  Gift,
  Rocket,
  Lock,
  Unlock,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
  popular?: boolean;
  bestValue?: boolean;
  icon: React.ReactNode;
  trial?: string;
  savings?: string;
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
      'Apenas 1 personagem liberado',
      'Sem modo quente',
      'Apenas um Roleplay ativo',
      'Sem gerar respostas longas',
      'Sem análise avançada',
      'Sem imagens',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.90,
    interval: 'month',
    stripePriceId: 'price_premium_monthly',
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    trial: 'Trial de 3 dias ativado com cartão',
    features: [
      'Mensagens ilimitadas',
      'Personagens ilimitados',
      'Modo quente',
      'Modo Fantasia ilimitada',
      'Respostas longas',
      'Análises ilimitadas',
      'Gerador avançado',
      'Prioridade na IA',
    ],
  },
  {
    id: 'premium_yearly',
    name: 'Anual',
    price: 169.90,
    interval: 'year',
    stripePriceId: 'price_premium_yearly',
    icon: <Star className="w-6 h-6" />,
    bestValue: true,
    savings: 'Economize R$ 68,90',
    features: [
      'Mensagens ilimitadas',
      'Personagens ilimitados',
      'Modo quente',
      'Modo Fantasia ilimitada',
      'Respostas longas',
      'Análises ilimitadas',
      'Gerador avançado',
      'Prioridade na IA',
      '12 meses pelo preço de 8,5',
      'Suporte prioritário',
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
          userId: 'user_demo_123',
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#9B4DFF] to-[#6A0DAD] rounded-2xl mb-6 shadow-lg shadow-[#9B4DFF]/50">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9B4DFF] to-[#FF6B9D] bg-clip-text text-transparent mb-4">
            Desbloqueie Todo o Potencial
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Tenha acesso ilimitado a todos os recursos premium e transforme suas conversas em experiências inesquecíveis.
          </p>
          
          {/* Destaque de economia */}
          <div className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-full px-6 py-3">
            <TrendingDown className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">
              Economize até 29% com o plano anual!
            </span>
          </div>
        </div>

        {/* Plans - CORRIGIDO COM FLEX E ALTURA UNIFORME */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 flex flex-col ${
                plan.bestValue
                  ? 'bg-gradient-to-br from-[#9B4DFF]/30 to-[#6A0DAD]/30 border-[#9B4DFF] md:scale-105 shadow-2xl shadow-[#9B4DFF]/50 ring-4 ring-[#9B4DFF]/50 ring-offset-4 ring-offset-[#0D0D0D]'
                  : plan.popular
                  ? 'bg-gradient-to-br from-[#9B4DFF]/20 to-[#6A0DAD]/20 border-[#9B4DFF]/70'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge de destaque */}
              {plan.bestValue && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-[#9B4DFF] via-[#FF6B9D] to-[#9B4DFF] text-white px-4 py-2 text-center text-sm font-bold animate-pulse">
                    🔥 MELHOR OFERTA - ECONOMIA MÁXIMA 🔥
                  </div>
                </div>
              )}
              
              {plan.popular && !plan.bestValue && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Conteúdo do card com flex-grow para empurrar botão para baixo */}
              <div className="flex-grow flex flex-col">
                <div className={`text-center ${plan.bestValue ? 'mt-12' : plan.popular ? 'mt-6' : 'mt-0'} mb-6`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    plan.bestValue 
                      ? 'bg-gradient-to-br from-[#9B4DFF] to-[#6A0DAD] shadow-lg shadow-[#9B4DFF]/50' 
                      : plan.popular 
                      ? 'bg-[#9B4DFF]/20' 
                      : 'bg-white/10'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  
                  {/* Preço com destaque */}
                  <div className="mb-2">
                    {plan.bestValue && (
                      <div className="text-sm text-white/50 line-through mb-1">
                        De R$ 238,80
                      </div>
                    )}
                    <div className={`text-4xl font-bold ${plan.bestValue ? 'text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text' : ''}`}>
                      R$ {plan.price.toFixed(2)}
                      <span className="text-lg text-white/60">
                        /{plan.interval === 'month' ? 'mês' : 'ano'}
                      </span>
                    </div>
                  </div>

                  {/* Savings badge */}
                  {plan.savings && (
                    <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/50 rounded-full px-3 py-1 mb-2">
                      <Gift className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-bold">
                        {plan.savings}
                      </span>
                    </div>
                  )}

                  {plan.trial && (
                    <p className="text-xs text-green-400 mt-2 font-semibold">
                      {plan.trial}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {plan.id === 'free' && index > 0 ? (
                        <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.bestValue ? 'text-green-400' : 'text-green-400'
                        }`} />
                      )}
                      <span className={`text-sm ${plan.bestValue ? 'font-medium' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão fixo na parte inferior */}
              <div className="mt-auto">
                <Button
                  className={`w-full transition-all duration-300 ${
                    plan.bestValue 
                      ? 'bg-gradient-to-r from-[#9B4DFF] via-[#FF6B9D] to-[#9B4DFF] hover:shadow-2xl hover:shadow-[#9B4DFF]/50 hover:scale-105 text-lg font-bold py-4' 
                      : plan.popular 
                      ? 'bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] py-3' 
                      : 'py-3'
                  }`}
                  variant={plan.popular || plan.bestValue ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? (
                    'Processando...'
                  ) : plan.id === 'free' ? (
                    <span className="flex items-center justify-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Continuar Gratuito
                    </span>
                  ) : plan.bestValue ? (
                    <span className="flex items-center justify-center">
                      <Rocket className="w-5 h-5 mr-2" />
                      Garantir Desconto Anual
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Unlock className="w-4 h-4 mr-2" />
                      Assinar Agora
                    </span>
                  )}
                </Button>

                {/* Extra CTA para plano anual */}
                {plan.bestValue && (
                  <p className="text-center text-xs text-white/60 mt-3">
                    ⚡ Oferta limitada - Garanta já!
                  </p>
                )}
              </div>
            </Card>
          ))}</div>

        {/* Social Proof */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#9B4DFF]/50 transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-[#9B4DFF] mb-2">10k+</div>
              <p className="text-white/60">Usuários ativos</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FF6B9D]/50 transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-[#FF6B9D] mb-2">4.9/5</div>
              <p className="text-white/60">Avaliação média</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
              <p className="text-white/60">Satisfação</p>
            </div>
          </div>
        </div>

        {/* FAQ Expandido */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#9B4DFF] to-[#FF6B9D] bg-clip-text text-transparent">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#9B4DFF]" />
                Por que o plano Anual é a melhor escolha?
              </h3>
              <p className="text-white/60 text-sm">
                Com o plano Anual, você economiza R$ 68,90 por ano em comparação ao plano mensal. É como pagar por 8,5 meses e ganhar 3,5 meses grátis! Além disso, você garante o preço atual por 12 meses, sem surpresas.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-400" />
                Como funciona o trial de 3 dias?
              </h3>
              <p className="text-white/60 text-sm">
                Ao assinar o plano Premium, você terá 3 dias de teste gratuito com acesso completo a todos os recursos. Após esse período, será cobrado automaticamente caso não cancele. Você pode cancelar a qualquer momento durante o trial sem custo algum.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400" />
                O que acontece quando atinjo o limite do plano gratuito?
              </h3>
              <p className="text-white/60 text-sm">
                Quando você atingir o limite de 20 mensagens diárias no plano gratuito, será direcionado automaticamente para a tela de planos de assinatura. Você poderá escolher entre o plano Premium mensal ou Anual para continuar conversando sem limites.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-white/60 text-sm">
                Sim! Você pode cancelar sua assinatura a qualquer momento, sem burocracia. O acesso premium continuará até o final do período pago. Não há taxas de cancelamento ou multas.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Posso mudar de plano depois?
              </h3>
              <p className="text-white/60 text-sm">
                Sim! Você pode fazer upgrade do plano mensal para o anual a qualquer momento e aproveitar a economia. Também é possível fazer downgrade, mas recomendamos o plano anual pela melhor relação custo-benefício.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Quais são as formas de pagamento aceitas?
              </h3>
              <p className="text-white/60 text-sm">
                Aceitamos cartões de crédito e débito das principais bandeiras (Visa, Mastercard, American Express, Elo). O pagamento é processado de forma segura através do Stripe, líder mundial em pagamentos online.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                O que é o "Modo Quente"?
              </h3>
              <p className="text-white/60 text-sm">
                O Modo Quente é um recurso exclusivo para assinantes que permite conversas mais ousadas e personalizadas com os personagens de IA. Disponível apenas nos planos Premium e Anual.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Quantos personagens posso criar?
              </h3>
              <p className="text-white/60 text-sm">
                No plano gratuito, você tem acesso a apenas 1 personagem. Nos planos Premium e Anual, você pode criar e conversar com personagens ilimitados, explorando diferentes personalidades e cenários.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-[#9B4DFF]/50 transition-colors">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-400" />
                O que é "Prioridade na IA"?
              </h3>
              <p className="text-white/60 text-sm">
                Assinantes Premium e Anual têm prioridade no processamento das mensagens, garantindo respostas mais rápidas mesmo em horários de pico. Você nunca ficará esperando!
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <div className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-br from-[#9B4DFF]/20 to-[#6A0DAD]/20 border border-[#9B4DFF] rounded-3xl p-12 hover:shadow-2xl hover:shadow-[#9B4DFF]/30 transition-all duration-300">
          <Star className="w-16 h-16 text-[#9B4DFF] mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar suas conversas?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Junte-se a milhares de usuários satisfeitos e desbloqueie todo o potencial da IA.
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-gradient-to-r from-[#9B4DFF] via-[#FF6B9D] to-[#9B4DFF] hover:shadow-2xl hover:shadow-[#9B4DFF]/50 hover:scale-105 text-lg px-8 py-6 transition-all duration-300"
              onClick={() => handleSubscribe(plans[2])}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Começar Agora com Desconto
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
