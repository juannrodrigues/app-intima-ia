'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Wand2, 
  Drama, 
  BarChart3, 
  Trophy, 
  Flame,
  Target,
  CheckCircle2,
  Clock,
  LogOut,
  User,
  Settings,
  Sparkles,
  TrendingUp,
  Heart,
  Zap,
  Loader2,
  Sun,
  Moon,
  Shield
} from 'lucide-react';
import { getUserData } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Usuário');
  const [userEmail, setUserEmail] = useState('usuario@exemplo.com');
  const [userRole, setUserRole] = useState('user');
  const [showWelcome, setShowWelcome] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userStats, setUserStats] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Verificar se usuário está logado
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/login');
          return;
        }

        // Buscar dados do localStorage
        const storedName = localStorage.getItem('userName') || 'Usuário';
        const storedEmail = localStorage.getItem('userEmail') || 'usuario@exemplo.com';
        const storedRole = localStorage.getItem('userRole') || 'user';
        const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
        const savedAvatar = localStorage.getItem('userAvatar') || '';

        setUserName(storedName);
        setUserEmail(storedEmail);
        setUserRole(storedRole);
        setTheme(savedTheme);
        setAvatarUrl(savedAvatar);

        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        document.documentElement.classList.toggle('light', savedTheme === 'light');

        // Buscar dados do Supabase
        const { user, stats, missions: userMissions, activities: userActivities, error } = await getUserData(userId);

        if (error) {
          console.error('Erro ao buscar dados:', error);
        } else {
          setUserStats(stats);
          setMissions(userMissions);
          setActivities(userActivities);
        }

        setShowWelcome(true);
        setLoading(false);
        setTimeout(() => setShowWelcome(false), 3000);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat': return MessageSquare;
      case 'message': return Wand2;
      case 'roleplay': return Drama;
      case 'analysis': return BarChart3;
      default: return MessageSquare;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-lg">Carregando seu dashboard...</p>
          <p className="text-white/60 text-sm mt-2">Preparando sua experiência personalizada</p>
        </div>
      </div>
    );
  }

  const completedMissions = missions.filter(m => m.completed).length;
  const totalXPToday = missions.filter(m => m.completed).reduce((sum, m) => sum + m.xp, 0);
  const currentLevel = userStats?.level || 1;
  const currentXP = userStats?.xp || 0;
  const maxXP = userStats?.max_xp || 1000;
  const currentStreak = userStats?.streak || 0;
  const totalConversations = userStats?.total_conversations || 0;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white' : 'bg-gradient-to-br from-[#F5E6D3] via-[#E8D4B8] to-[#F5E6D3] text-gray-800'} transition-all duration-500`}>
      {/* Welcome Message */}
      {showWelcome && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 border-2 border-purple-400 p-4 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.6)]">
            <p className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Bem-vindo de volta, {userName}! {userRole === 'admin' && '👑'}
            </p>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-white/10 bg-black/30' : 'border-gray-300 bg-white/30'} backdrop-blur-sm sticky top-0 z-40`}>
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
              {userRole === 'admin' && (
                <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  ADMIN
                </span>
              )}
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

              {/* Botão Perfil */}
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
                className={`${theme === 'dark' ? 'bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-600/40 text-white' : 'bg-gradient-to-br from-cyan-200/50 to-cyan-300/50 border-2 border-cyan-400 hover:border-cyan-500 hover:bg-cyan-300/60 text-gray-800'} hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline">Perfil</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className={`${theme === 'dark' ? 'bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-600/40 text-white' : 'bg-gradient-to-br from-purple-200/50 to-purple-300/50 border-2 border-purple-400 hover:border-purple-500 hover:bg-purple-300/60 text-gray-800'} hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Bem-vindo de volta, {userName}! 👋
          </h1>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
            Continue sua jornada e complete suas missões diárias
            {userRole === 'admin' && ' • Você tem acesso total como administrador'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Level Card */}
          <Card className={`${theme === 'dark' ? 'bg-gradient-to-br from-purple-600/20 to-purple-800/20' : 'bg-gradient-to-br from-purple-200/50 to-purple-300/50'} border-2 border-purple-500/50 p-6 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-purple-400" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Nível {currentLevel}</span>
            </div>
            <div className="mb-2">
              <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1`}>
                <span>XP</span>
                <span>{currentXP}/{maxXP}</span>
              </div>
              <div className={`w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-300'} rounded-full h-2`}>
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentXP / maxXP) * 100}%` }}
                />
              </div>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>+{totalXPToday} XP hoje</p>
          </Card>

          {/* Streak Card */}
          <Card className={`${theme === 'dark' ? 'bg-gradient-to-br from-orange-600/20 to-red-600/20' : 'bg-gradient-to-br from-orange-200/50 to-red-200/50'} border-2 border-orange-500/50 p-6 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-400" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{currentStreak} dias</span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Sequência ativa</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} mt-2`}>Continue assim! 🔥</p>
          </Card>

          {/* Missions Card */}
          <Card className={`${theme === 'dark' ? 'bg-gradient-to-br from-cyan-600/20 to-blue-600/20' : 'bg-gradient-to-br from-cyan-200/50 to-blue-200/50'} border-2 border-cyan-500/50 p-6 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-cyan-400" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{completedMissions}/{missions.length}</span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Missões completas</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} mt-2`}>Hoje</p>
          </Card>

          {/* Activity Card */}
          <Card className={`${theme === 'dark' ? 'bg-gradient-to-br from-pink-600/20 to-rose-600/20' : 'bg-gradient-to-br from-pink-200/50 to-rose-200/50'} border-2 border-pink-500/50 p-6 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-pink-400" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{totalConversations}</span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Conversas ativas</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} mt-2`}>Total</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className={`${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20' : 'bg-gradient-to-br from-cyan-200/50 via-blue-200/50 to-purple-200/50'} border-4 border-cyan-400 p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(34,211,238,0.8),0_0_100px_rgba(34,211,238,0.4)] hover:shadow-[0_0_70px_rgba(34,211,238,1),0_0_120px_rgba(34,211,238,0.6)] transition-all duration-300 animate-pulse-slow`}>
              <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                <Wand2 className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,1)]" />
                Menu Intima IA
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Button
                  onClick={() => router.push('/chat')}
                  className="h-auto py-8 bg-gradient-to-br from-purple-600 to-purple-800 border-4 border-purple-400 hover:border-purple-300 hover:shadow-[0_0_40px_rgba(168,85,247,1),0_0_80px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 flex flex-col items-center gap-4 text-white shadow-[0_0_30px_rgba(168,85,247,0.7)]"
                >
                  <MessageSquare className="w-16 h-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="text-center">
                    <p className="font-bold text-xl">Chat com IA</p>
                    <p className="text-sm text-purple-200">Converse agora</p>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push('/generator')}
                  className="h-auto py-8 bg-gradient-to-br from-pink-600 to-pink-800 border-4 border-pink-400 hover:border-pink-300 hover:shadow-[0_0_40px_rgba(236,72,153,1),0_0_80px_rgba(236,72,153,0.6)] hover:scale-105 transition-all duration-300 flex flex-col items-center gap-4 text-white shadow-[0_0_30px_rgba(236,72,153,0.7)]"
                >
                  <Wand2 className="w-16 h-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="text-center">
                    <p className="font-bold text-xl">Gerador de Mensagens</p>
                    <p className="text-sm text-pink-200">Crie mensagens únicas</p>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push('/roleplay')}
                  className="h-auto py-8 bg-gradient-to-br from-cyan-600 to-cyan-800 border-4 border-cyan-400 hover:border-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,1),0_0_80px_rgba(34,211,238,0.6)] hover:scale-105 transition-all duration-300 flex flex-col items-center gap-4 text-white shadow-[0_0_30px_rgba(34,211,238,0.7)]"
                >
                  <Drama className="w-16 h-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="text-center">
                    <p className="font-bold text-xl">Modo Fantasia</p>
                    <p className="text-sm text-cyan-200">Roleplay guiado</p>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push('/analysis')}
                  className="h-auto py-8 bg-gradient-to-br from-orange-600 to-orange-800 border-4 border-orange-400 hover:border-orange-300 hover:shadow-[0_0_40px_rgba(249,115,22,1),0_0_80px_rgba(249,115,22,0.6)] hover:scale-105 transition-all duration-300 flex flex-col items-center gap-4 text-white shadow-[0_0_30px_rgba(249,115,22,0.7)]"
                >
                  <BarChart3 className="w-16 h-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="text-center">
                    <p className="font-bold text-xl">Análise de Conversas</p>
                    <p className="text-sm text-orange-200">Insights profundos</p>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Daily Missions */}
            <Card className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'} border-2 border-purple-500/30 p-6 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Missões do Dia
                </h2>
                <span className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>{completedMissions}/{missions.length} completas</span>
              </div>

              <div className="space-y-4">
                {missions.length > 0 ? (
                  missions.map((mission) => (
                    <div
                      key={mission.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        mission.completed
                          ? 'bg-green-500/10 border-green-500/50'
                          : theme === 'dark' 
                            ? 'bg-white/5 border-white/10 hover:border-purple-500/50'
                            : 'bg-white/50 border-gray-300 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {mission.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-400" />
                            )}
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{mission.title}</h3>
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>{mission.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                          <Zap className="w-4 h-4" />
                          <span>{mission.xp} XP</span>
                        </div>
                      </div>

                      {!mission.completed && (
                        <div className="mt-3">
                          <div className={`flex justify-between text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} mb-1`}>
                            <span>Progresso</span>
                            <span>{mission.progress}/{mission.total}</span>
                          </div>
                          <div className={`w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-300'} rounded-full h-2`}>
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className={`text-center py-8 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                    Nenhuma missão disponível no momento
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'} border-2 border-pink-500/30 p-6 backdrop-blur-sm`}>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <TrendingUp className="w-5 h-5 text-pink-400" />
                Atividades Recentes
              </h2>

              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity) => {
                    const Icon = getActivityIcon(activity.activity_type);
                    return (
                      <div
                        key={activity.id}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5 border border-white/10 hover:border-purple-500/50' : 'bg-white/50 border border-gray-300 hover:border-purple-500/50'} transition-all cursor-pointer`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <Icon className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{activity.title}</p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>{formatTimestamp(activity.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className={`text-center py-4 text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                    Nenhuma atividade recente
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
