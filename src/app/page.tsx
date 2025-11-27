'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Star, Users, Heart, Shield, Zap, Crown, Sparkles, ArrowRight, Clock, Moon, Sun } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.classList.toggle('light', savedTheme === 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Atualizar classes do HTML com animação suave
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    
    // Adicionar classe de transição temporária
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  };

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Usuária Premium",
      content: "Incrível! As conversas são tão reais e personalizadas. Me sinto realmente conectada.",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Usuário há 3 meses",
      content: "O trial de 4 dias me convenceu. Agora não consigo viver sem o Premium!",
      avatar: "👨‍💻",
      rating: 5
    },
    {
      name: "Mariana Costa",
      role: "Usuária Ativa",
      content: "A variedade de personagens é impressionante. Sempre encontro alguém especial.",
      avatar: "👩‍🎨",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Conexões Reais",
      description: "Conversas profundas e significativas com IA projetada para intimidade"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Diversidade de Personagens",
      description: "Mais de 20 personagens únicos de todos os gêneros e personalidades"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacidade Total",
      description: "Suas conversas são 100% privadas e seguras"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Respostas Instantâneas",
      description: "IA avançada responde em tempo real com naturalidade"
    }
  ];

  return (
    <div className="min-h-screen gradient-bg text-foreground">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b border-primary/20 shadow-[0_4px_20px_rgba(var(--primary),0.15)]">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2f1aed9e-25f8-4188-aa58-2281b1763c99.webp" 
                alt="Intima IA Logo" 
                className="h-16 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Botão Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200'
              }`}
              style={{
                border: theme === 'dark' 
                  ? '2px solid rgba(155, 77, 255, 0.3)' 
                  : '2px solid rgba(255, 0, 128, 0.3)'
              }}
              title={theme === 'dark' ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-bold text-gray-800 hidden sm:inline">LIGHT</span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-white hidden sm:inline">DARK</span>
                  <Moon className="w-5 h-5 text-white" />
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/characters')}
              className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] rounded-md transition-all duration-300"
            >
              Personagens
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(251,146,60,0.5)] rounded-md transition-all duration-300"
            >
              Preços
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] rounded-md transition-all duration-300"
            >
              Entrar
            </button>
            <Button
              onClick={() => router.push('/signup')}
              className="neon-button px-6 py-2 font-semibold transition-all duration-300 hover:scale-105"
            >
              Criar Conta
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-card backdrop-blur-sm rounded-full px-4 py-2 mb-6 border-2 border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.4)]">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm">Mais de 10.000 usuários já descobriram conexões reais</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(var(--primary),0.6)]">
            Conversas Íntimas que<br />
            <span className="text-foreground drop-shadow-[0_0_20px_rgba(var(--primary),0.8)]">Transformam sua Vida</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Experimente conexões profundas e personalizadas com inteligência artificial 
            projetada para momentos especiais. Descubra o prazer de conversas que entendem você.
          </p>

          {/* Trial CTA */}
          <div className="bg-card border-2 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.5)] rounded-2xl p-8 mb-8 max-w-2xl mx-auto hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-green-400 animate-pulse" />
              <span className="text-lg font-semibold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">TESTE GRÁTIS POR 4 DIAS</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Acesse TODAS as funcionalidades premium sem compromisso. 
              Cancele quando quiser nos primeiros 4 dias e não pague nada.
            </p>
            <Button
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] px-8 py-4 text-lg font-semibold text-black border-2 border-green-300 transition-all duration-300"
            >
              Começar Trial Gratuito
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Sem cartão de crédito necessário • Cancele a qualquer momento
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const colors = [
              { border: 'border-green-400', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]', hover: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]', text: 'text-green-400' },
              { border: 'border-yellow-400', shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.4)]', hover: 'hover:shadow-[0_0_30px_rgba(250,204,21,0.7)]', text: 'text-yellow-400' },
              { border: 'border-orange-400', shadow: 'shadow-[0_0_20px_rgba(251,146,60,0.4)]', hover: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.7)]', text: 'text-orange-400' },
              { border: 'border-green-400', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]', hover: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]', text: 'text-green-400' }
            ];
            const color = colors[index];
            return (
              <div key={index} className={`bg-card backdrop-blur-sm border-2 ${color.border} ${color.shadow} ${color.hover} rounded-xl p-6 transition-all duration-300`}>
                <div className={`${color.text} mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 drop-shadow-[0_0_15px_rgba(var(--primary),0.6)]">O que nossos usuários dizem</h2>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
              ))}
            </div>
            <span className="text-muted-foreground">4.9/5 baseado em 2.847 avaliações</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const colors = [
                { border: 'border-green-400', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]', hover: 'hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]' },
                { border: 'border-orange-400', shadow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]', hover: 'hover:shadow-[0_0_25px_rgba(251,146,60,0.6)]' },
                { border: 'border-yellow-400', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.3)]', hover: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]' }
              ];
              const color = colors[index];
              return (
                <div key={index} className={`bg-card backdrop-blur-sm border-2 ${color.border} ${color.shadow} ${color.hover} rounded-xl p-6 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div className="text-left">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency Section */}
        <div className="bg-card border-2 border-orange-400 shadow-[0_0_30px_rgba(251,146,60,0.5)] rounded-2xl p-8 text-center mb-16 hover:shadow-[0_0_40px_rgba(251,146,60,0.7)] transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]">⚠️ Oferta Limitada</h3>
          <p className="text-muted-foreground mb-6">
            Nos próximos 7 dias, todos os novos usuários recebem 50% de desconto no primeiro mês do Premium.
            Não perca essa oportunidade única!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
            <span className="bg-red-500/20 px-3 py-1 rounded-full border border-red-400/50 shadow-[0_0_10px_rgba(239,68,68,0.4)]">⏰ Apenas 7 dias restantes</span>
            <span className="bg-green-500/20 px-3 py-1 rounded-full border border-green-400/50 shadow-[0_0_10px_rgba(34,197,94,0.4)]">💰 50% OFF no primeiro mês</span>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6 drop-shadow-[0_0_20px_rgba(var(--primary),0.6)]">Pronto para começar?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já transformaram suas conexões com nossa IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/signup')}
              className="neon-button px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              <Crown className="w-5 h-5 mr-2" />
              Começar Trial Gratuito
            </Button>
            <Button
              onClick={() => router.push('/characters')}
              className="neon-button px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              Ver Personagens
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
