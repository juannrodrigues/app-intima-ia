'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase, getUser, signOut } from '@/lib/supabase';
import { MessageCircle, Send, Settings, LogOut, Sparkles, Users, Smile, Heart, Flame, Moon, Sun, Zap, Volume2, Trophy, Target, Image as ImageIcon, Crown, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      router.push('/login');
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  // Dados simulados - em produção viriam do banco
  const stats = {
    messagesCount: 127,
    missionsCompleted: 8,
    charactersUnlocked: 3,
    imagesGenerated: 15
  };

  const trialDaysLeft = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2f1aed9e-25f8-4188-aa58-2281b1763c99.webp"
                alt="Intima IA Logo"
                className="h-8 w-auto drop-shadow-[0_0_10px_rgba(155,77,255,0.8)]"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] bg-clip-text text-transparent">
                Intima IA
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg bg-transparent border-2 border-[#FF0080] text-white font-medium shadow-[0_0_15px_rgba(255,0,128,0.5)] hover:shadow-[0_0_25px_rgba(255,0,128,0.8)] hover:bg-[#FF0080]/10 transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Olá, <span className="bg-gradient-to-r from-[#9B4DFF] to-[#FF0080] bg-clip-text text-transparent">{user?.email?.split('@')[0] || 'Usuário'}</span>! 👋
          </h1>
          <p className="text-white/70 text-lg">
            Bem-vindo de volta ao seu espaço de experiências personalizadas.
          </p>
        </div>

        {/* Trial Status Banner - CTA Apelativo */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#9B4DFF]/20 via-[#FF0080]/20 to-[#00D9FF]/20 border-2 border-[#9B4DFF] shadow-[0_0_30px_rgba(155,77,255,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9B4DFF]/10 to-[#FF0080]/10 animate-pulse"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#9B4DFF] to-[#FF0080] shadow-[0_0_20px_rgba(155,77,255,0.6)]">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                  Trial Premium Ativo
                  <Clock className="w-5 h-5 text-[#00D9FF]" />
                </h3>
                <p className="text-white/80">
                  Restam <span className="font-bold text-[#00D9FF]">{trialDaysLeft} dias</span> para aproveitar todos os recursos!
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/upgrade')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#FF0080] text-white font-bold text-lg shadow-[0_0_25px_rgba(155,77,255,0.6)] hover:shadow-[0_0_40px_rgba(155,77,255,0.9)] hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              🚀 Fazer Upgrade Agora!
            </button>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Chat */}
          <button
            onClick={() => router.push('/chat')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#9B4DFF]/10 to-[#9B4DFF]/5 border-2 border-[#9B4DFF] hover:border-[#9B4DFF] hover:shadow-[0_0_30px_rgba(155,77,255,0.5)] transition-all duration-300 text-left hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#9B4DFF]/20 group-hover:bg-[#9B4DFF]/30 transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-[#9B4DFF]" />
              </div>
              <Sparkles className="w-6 h-6 text-[#9B4DFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Chat com IA</h3>
            <p className="text-white/70 text-sm">Converse com personagens personalizados</p>
          </button>

          {/* Missões */}
          <button
            onClick={() => router.push('/missions')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#FF0080]/10 to-[#FF0080]/5 border-2 border-[#FF0080] hover:border-[#FF0080] hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] transition-all duration-300 text-left hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#FF0080]/20 group-hover:bg-[#FF0080]/30 transition-all duration-300">
                <Target className="w-8 h-8 text-[#FF0080]" />
              </div>
              <Sparkles className="w-6 h-6 text-[#FF0080] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Missões</h3>
            <p className="text-white/70 text-sm">Complete desafios e ganhe recompensas</p>
          </button>

          {/* Personagens */}
          <button
            onClick={() => router.push('/characters')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#00D9FF]/10 to-[#00D9FF]/5 border-2 border-[#00D9FF] hover:border-[#00D9FF] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all duration-300 text-left hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#00D9FF]/20 group-hover:bg-[#00D9FF]/30 transition-all duration-300">
                <Users className="w-8 h-8 text-[#00D9FF]" />
              </div>
              <Sparkles className="w-6 h-6 text-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personagens</h3>
            <p className="text-white/70 text-sm">Explore e desbloqueie novos personagens</p>
          </button>

          {/* Gerador */}
          <button
            onClick={() => router.push('/generator')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 border-2 border-[#FFD700] hover:border-[#FFD700] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 text-left hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#FFD700]/20 group-hover:bg-[#FFD700]/30 transition-all duration-300">
                <ImageIcon className="w-8 h-8 text-[#FFD700]" />
              </div>
              <Sparkles className="w-6 h-6 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gerador</h3>
            <p className="text-white/70 text-sm">Crie imagens personalizadas com IA</p>
          </button>
        </div>

        {/* Statistics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-[#FFD700]" />
            Suas Estatísticas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Mensagens */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#9B4DFF]/10 to-black/20 border border-[#9B4DFF]/30">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-6 h-6 text-[#9B4DFF]" />
                <span className="text-3xl font-bold text-[#9B4DFF]">{stats.messagesCount}</span>
              </div>
              <p className="text-white/70 text-sm">Mensagens enviadas</p>
            </div>

            {/* Missões */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#FF0080]/10 to-black/20 border border-[#FF0080]/30">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-[#FF0080]" />
                <span className="text-3xl font-bold text-[#FF0080]">{stats.missionsCompleted}</span>
              </div>
              <p className="text-white/70 text-sm">Missões completas</p>
            </div>

            {/* Personagens */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#00D9FF]/10 to-black/20 border border-[#00D9FF]/30">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-[#00D9FF]" />
                <span className="text-3xl font-bold text-[#00D9FF]">{stats.charactersUnlocked}</span>
              </div>
              <p className="text-white/70 text-sm">Personagens desbloqueados</p>
            </div>

            {/* Imagens */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-black/20 border border-[#FFD700]/30">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-6 h-6 text-[#FFD700]" />
                <span className="text-3xl font-bold text-[#FFD700]">{stats.imagesGenerated}</span>
              </div>
              <p className="text-white/70 text-sm">Imagens geradas</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#9B4DFF]/20 via-[#FF0080]/20 to-[#00D9FF]/20 border-2 border-[#9B4DFF]/50 text-center">
          <h3 className="text-2xl font-bold mb-3">
            Desbloqueie Todo o Potencial do Intima IA 🔥
          </h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Acesso ilimitado a todos os personagens, missões exclusivas, gerador de imagens premium e muito mais!
          </p>
          <button
            onClick={() => router.push('/upgrade')}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#FF0080] text-white font-bold text-lg shadow-[0_0_25px_rgba(155,77,255,0.6)] hover:shadow-[0_0_40px_rgba(155,77,255,0.9)] hover:scale-105 transition-all duration-300"
          >
            💎 Upgrade para Premium
          </button>
        </div>
      </div>
    </div>
  );
}
