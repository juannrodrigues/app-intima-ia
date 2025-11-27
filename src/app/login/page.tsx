'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2, UserPlus, Sun, Moon } from 'lucide-react';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validação básica
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Fazer login com Supabase
      const { user, error: authError } = await signIn(email, password);

      if (authError || !user) {
        throw new Error(authError || 'Erro ao fazer login');
      }

      // Salvar dados do usuário no localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', user.role);

      setSuccessMessage(`✨ Bem-vindo, ${user.name}!`);
      
      // Aguarda um momento para o usuário ver a mensagem
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redireciona para o dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]' : 'bg-gradient-to-br from-[#F5E6D3] via-[#E8D4B8] to-[#F5E6D3]'} text-white flex items-center justify-center p-4 transition-all duration-500`}>
      {/* Botão Theme Toggle - Canto Superior Direito */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 ${
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

      <Card className={`w-full max-w-md ${theme === 'dark' ? 'bg-white/5' : 'bg-white/90'} border-2 border-transparent backdrop-blur-sm p-8 relative overflow-hidden
        before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-500 before:-z-10
        after:absolute after:inset-[2px] after:rounded-xl ${theme === 'dark' ? 'after:bg-gradient-to-br after:from-[#0D0D0D]/95 after:to-[#1A1A1A]/95' : 'after:bg-gradient-to-br after:from-[#F5E6D3]/95 after:to-[#E8D4B8]/95'} after:-z-10
        shadow-[0_0_30px_rgba(168,85,247,0.4)]
        hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]
        transition-all duration-300`}>
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2f1aed9e-25f8-4188-aa58-2281b1763c99.webp"
              alt="Intima IA Logo"
              className="h-10 w-auto drop-shadow-[0_0_10px_rgba(155,77,255,0.8)]"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(155,77,255,0.5)]">
              Intima IA
            </span>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Bem-vindo de volta</h1>
          <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-600'}>Entre na sua conta para continuar</p>
        </div>

        {/* Credenciais de Admin Destacadas */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-xl relative z-10">
          <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🔑 Credenciais de Admin:</p>
          <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
            <p><strong>Email:</strong> admin@intimaia.com</p>
            <p><strong>Senha:</strong> admin123</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/20 border-2 border-red-500 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-500/20 border-2 border-green-500 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-green-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {successMessage}
              </p>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${theme === 'dark' ? 'bg-white/10 text-white placeholder:text-white/40' : 'bg-white/50 text-gray-800 placeholder:text-gray-400'} border-2 border-cyan-500/50 rounded-xl 
                  focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,211,238,0.4)]
                  transition-all duration-300
                  hover:border-cyan-400/70`}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 ${theme === 'dark' ? 'bg-white/10 text-white placeholder:text-white/40' : 'bg-white/50 text-gray-800 placeholder:text-gray-400'} border-2 border-pink-500/50 rounded-xl 
                  focus:border-pink-400 focus:outline-none focus:shadow-[0_0_20px_rgba(236,72,153,0.4)]
                  transition-all duration-300
                  hover:border-pink-400/70`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-300 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#9B4DFF] via-[#8B3DFF] to-[#6A0DAD] 
              hover:shadow-[0_0_30px_rgba(155,77,255,0.7)] 
              border-2 border-purple-500/50
              hover:border-purple-400
              py-3 text-white font-semibold
              transition-all duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* BOTÃO DESTACADO PARA CRIAR CONTA */}
        <div className="mt-8 relative z-10">
          <div className="p-4 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 
            border-2 border-green-500/50 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-center mb-3 font-medium`}>
              🎉 Primeira vez aqui?
            </p>
            <Button
              onClick={() => router.push('/signup')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600
                hover:from-green-400 hover:to-emerald-500
                shadow-[0_0_20px_rgba(34,197,94,0.5)]
                hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]
                border-2 border-green-400/50
                hover:border-green-300
                py-3 text-white font-bold
                transition-all duration-300
                hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Criar Conta Grátis
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20 relative z-10">
          <button
            onClick={() => router.push('/')}
            disabled={loading}
            className={`w-full ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600/30 to-purple-800/30 text-white' : 'bg-gradient-to-br from-purple-200/50 to-purple-300/50 text-gray-800'} border-2 border-purple-500/50 
              hover:bg-purple-600/40 hover:border-purple-400
              hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
              transition-all duration-300
              hover:scale-[1.02]
              disabled:opacity-50
              px-4 py-2 rounded-md font-medium`}
          >
            Voltar ao início
          </button>
        </div>
      </Card>
    </div>
  );
}
