'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Feedback visual de sucesso
      setSuccessMessage('Login realizado com sucesso! Redirecionando...');
      
      // Aguardar 1 segundo para mostrar mensagem antes de redirecionar
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      setSuccessMessage('Redirecionando para o Google...');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login com Google');
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      setSuccessMessage('Redirecionando para a Apple...');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login com Apple');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 border-2 border-transparent backdrop-blur-sm p-8 relative overflow-hidden
        before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-500 before:-z-10
        after:absolute after:inset-[2px] after:rounded-xl after:bg-gradient-to-br after:from-[#0D0D0D]/95 after:to-[#1A1A1A]/95 after:-z-10
        shadow-[0_0_30px_rgba(168,85,247,0.4)]
        hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]
        transition-all duration-300">
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
          <h1 className="text-2xl font-bold mb-2 text-white">Bem-vindo de volta</h1>
          <p className="text-white/80">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && (
            <div className="p-3 bg-red-500/20 border-2 border-red-500 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-500/20 border-2 border-green-500 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-green-200 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {successMessage}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border-2 border-cyan-500/50 rounded-xl 
                  focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,211,238,0.4)]
                  transition-all duration-300 text-white placeholder:text-white/40
                  hover:border-cyan-400/70"
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border-2 border-pink-500/50 rounded-xl 
                  focus:border-pink-400 focus:outline-none focus:shadow-[0_0_20px_rgba(236,72,153,0.4)]
                  transition-all duration-300 text-white placeholder:text-white/40
                  hover:border-pink-400/70"
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

        <div className="mt-6 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] text-white/70">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="bg-transparent border-2 border-red-500/50 hover:border-red-400 text-white 
                hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                transition-all duration-300 disabled:opacity-50 hover:scale-[1.02]
                px-4 py-2 rounded-md flex items-center justify-center font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading}
              className="bg-transparent border-2 border-gray-400/50 hover:border-gray-300 text-white 
                hover:bg-gray-500/10 hover:shadow-[0_0_20px_rgba(156,163,175,0.4)]
                transition-all duration-300 disabled:opacity-50 hover:scale-[1.02]
                px-4 py-2 rounded-md flex items-center justify-center font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        <div className="mt-6 text-center relative z-10">
          <p className="text-white/90 text-sm">
            Não tem uma conta?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-[#9B4DFF] hover:text-[#8B3DFF] font-medium underline decoration-2 decoration-purple-500/50 hover:decoration-purple-400 transition-all"
              disabled={loading}
            >
              Criar conta
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
          <button
            onClick={() => router.push('/')}
            disabled={loading}
            className="w-full bg-transparent border-2 border-yellow-500/60 text-white 
              hover:bg-yellow-500/10 hover:border-yellow-400
              hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]
              transition-all duration-300
              hover:scale-[1.02]
              disabled:opacity-50
              px-4 py-2 rounded-md font-medium"
          >
            Voltar ao início
          </button>
        </div>
      </Card>
    </div>
  );
}
