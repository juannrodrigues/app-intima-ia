'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User,
  Upload,
  Shuffle,
  Flame,
  Lock,
  CreditCard,
  XCircle,
  ArrowLeft,
  Camera,
  Check,
  Sun,
  Moon,
  Shield,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Usuário');
  const [userEmail, setUserEmail] = useState('usuario@exemplo.com');
  const [userRole, setUserRole] = useState('user');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [intensity, setIntensity] = useState<'leve' | 'moderada' | 'quente'>('moderada');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/login');
          return;
        }

        const storedName = localStorage.getItem('userName') || 'Usuário';
        const storedEmail = localStorage.getItem('userEmail') || 'usuario@exemplo.com';
        const storedRole = localStorage.getItem('userRole') || 'user';
        const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
        const savedAvatar = localStorage.getItem('userAvatar') || '';
        const savedIntensity = (localStorage.getItem('userIntensity') as 'leve' | 'moderada' | 'quente') || 'moderada';

        setUserName(storedName);
        setUserEmail(storedEmail);
        setUserRole(storedRole);
        setTheme(savedTheme);
        setAvatarUrl(savedAvatar);
        setIntensity(savedIntensity);

        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        document.documentElement.classList.toggle('light', savedTheme === 'light');

        setLoading(false);
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
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        localStorage.setItem('userAvatar', result);
        showSuccessMessage();
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomAvatar = () => {
    const avatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setAvatarUrl(randomAvatar);
    localStorage.setItem('userAvatar', randomAvatar);
    showSuccessMessage();
  };

  const handleIntensityChange = (newIntensity: 'leve' | 'moderada' | 'quente') => {
    setIntensity(newIntensity);
    localStorage.setItem('userIntensity', newIntensity);
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white' : 'bg-gradient-to-br from-[#F5E6D3] via-[#E8D4B8] to-[#F5E6D3] text-gray-800'} transition-all duration-500`}>
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className="bg-gradient-to-r from-green-600/90 to-emerald-600/90 border-2 border-green-400 p-4 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.6)]">
            <p className="text-white font-semibold flex items-center gap-2">
              <Check className="w-5 h-5" />
              Alterações salvas com sucesso!
            </p>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-white/10 bg-black/30' : 'border-gray-300 bg-white/30'} backdrop-blur-sm sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="ghost"
                className={`${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-200'}`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
            Personalize sua experiência no Intima IA
          </p>
        </div>

        {/* Avatar Section */}
        <Card className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'} border-2 border-purple-500/30 p-8 backdrop-blur-sm mb-6`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <Camera className="w-6 h-6 text-purple-400" />
            Avatar
          </h2>

          <div className="flex flex-col items-center gap-6">
            {/* Avatar Display */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold overflow-hidden border-4 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              {userRole === 'admin' && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-2 shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-center">
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {userName}
                {userRole === 'admin' && ' 👑'}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>{userEmail}</p>
            </div>

            {/* Avatar Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900' : 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700'} text-white`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Foto
              </Button>
              <Button
                onClick={generateRandomAvatar}
                variant="outline"
                className={`flex-1 ${theme === 'dark' ? 'border-purple-500/50 text-white hover:bg-purple-600/20' : 'border-purple-400 text-gray-800 hover:bg-purple-200/50'}`}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Avatar Aleatório
              </Button>
            </div>
          </div>
        </Card>

        {/* Intensity Settings */}
        <Card className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'} border-2 border-orange-500/30 p-8 backdrop-blur-sm mb-6`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <Flame className="w-6 h-6 text-orange-400" />
            Intensidade
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleIntensityChange('leve')}
              className={`p-6 rounded-xl border-2 transition-all ${
                intensity === 'leve'
                  ? 'bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-green-500/50'
                    : 'bg-white/50 border-gray-300 hover:border-green-500/50'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Leve</p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Conversas suaves</p>
              </div>
            </button>

            <button
              onClick={() => handleIntensityChange('moderada')}
              className={`p-6 rounded-xl border-2 transition-all ${
                intensity === 'moderada'
                  ? 'bg-gradient-to-br from-orange-600/30 to-orange-800/30 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                  : theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-orange-500/50'
                    : 'bg-white/50 border-gray-300 hover:border-orange-500/50'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Moderada</p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Equilíbrio perfeito</p>
              </div>
            </button>

            <button
              onClick={() => handleIntensityChange('quente')}
              className={`p-6 rounded-xl border-2 transition-all ${
                intensity === 'quente'
                  ? 'bg-gradient-to-br from-red-600/30 to-red-800/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                  : theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-red-500/50'
                    : 'bg-white/50 border-gray-300 hover:border-red-500/50'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🌶️</div>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Quente</p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Máxima intensidade</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => router.push('/characters')}
            className={`h-auto py-6 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900' : 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700'} text-white flex items-center justify-center gap-3`}
          >
            <User className="w-5 h-5" />
            <span className="font-semibold">Alterar Personagem</span>
          </Button>

          <Button
            onClick={() => router.push('/history')}
            variant="outline"
            className={`h-auto py-6 ${theme === 'dark' ? 'border-cyan-500/50 text-white hover:bg-cyan-600/20' : 'border-cyan-400 text-gray-800 hover:bg-cyan-200/50'} flex items-center justify-center gap-3`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Histórico</span>
          </Button>

          <Button
            onClick={() => router.push('/privacy')}
            variant="outline"
            className={`h-auto py-6 ${theme === 'dark' ? 'border-pink-500/50 text-white hover:bg-pink-600/20' : 'border-pink-400 text-gray-800 hover:bg-pink-200/50'} flex items-center justify-center gap-3`}
          >
            <Lock className="w-5 h-5" />
            <span className="font-semibold">Privacidade</span>
          </Button>

          <Button
            onClick={() => router.push('/subscription')}
            variant="outline"
            className={`h-auto py-6 ${theme === 'dark' ? 'border-yellow-500/50 text-white hover:bg-yellow-600/20' : 'border-yellow-400 text-gray-800 hover:bg-yellow-200/50'} flex items-center justify-center gap-3`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-semibold">Planos de Assinatura</span>
          </Button>
        </div>

        {/* Cancel Subscription */}
        <Card className={`${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-100/50'} border-2 border-red-500/30 p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Cancelar Assinatura</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} mt-1`}>
                Você perderá acesso aos recursos premium
              </p>
            </div>
            <Button
              onClick={() => {
                if (confirm('Tem certeza que deseja cancelar sua assinatura?')) {
                  alert('Assinatura cancelada com sucesso');
                }
              }}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
