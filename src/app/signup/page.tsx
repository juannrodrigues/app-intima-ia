'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isSupabaseConfigured } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Eye, EyeOff, Mail, Lock, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Verificar se Supabase está configurado
      if (!supabaseConfigured) {
        throw new Error('Configure o Supabase primeiro. Clique no banner laranja acima ou vá em Configurações → Integrações.');
      }

      // Validações
      if (!email || !password || !confirmPassword) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Criar cliente Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Criar conta
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Feedback de sucesso
      setSuccessMessage('✨ Conta criada com sucesso! Redirecionando...');
      
      // Aguarda um momento para o usuário ver a mensagem
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirecionar para dashboard após cadastro
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      
      // Mensagens de erro amigáveis
      if (err.message.includes('already registered')) {
        setError('Este email já está cadastrado. Tente fazer login!');
      } else if (err.message.includes('Invalid email')) {
        setError('Email inválido. Verifique e tente novamente.');
      } else {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 border-2 border-purple-500/50 backdrop-blur-xl p-8 
        shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] 
        transition-all duration-500 relative overflow-hidden group">
        
        {/* Efeito de brilho animado no fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <img
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2f1aed9e-25f8-4188-aa58-2281b1763c99.webp"
                  alt="Intima IA Logo"
                  className="h-12 w-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 
                bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                Intima IA
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              Criar conta
            </h1>
            <p className="text-white/80 text-lg">Junte-se a nós e comece suas conversas</p>
          </div>

          {!supabaseConfigured && (
            <div className="mb-6 p-4 bg-orange-500/20 border-2 border-orange-500 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-200 text-sm font-semibold mb-1">Supabase não configurado</p>
                  <p className="text-orange-200/80 text-xs">
                    Configure suas credenciais do Supabase para habilitar autenticação.
                    Clique no banner laranja acima ou vá em Configurações → Integrações.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl 
                shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-white text-sm font-medium">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-500/20 border-2 border-green-500/50 rounded-xl 
                shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {successMessage}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 
                  drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/50 border-2 border-cyan-500/50 rounded-xl 
                    focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] 
                    focus:outline-none transition-all duration-300 text-white placeholder:text-white/40
                    hover:border-cyan-400/70"
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Senha</label>
              <div className="relative group/input">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400 
                  drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-black/50 border-2 border-pink-500/50 rounded-xl 
                    focus:border-pink-400 focus:shadow-[0_0_20px_rgba(236,72,153,0.4)] 
                    focus:outline-none transition-all duration-300 text-white placeholder:text-white/40
                    hover:border-pink-400/70"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 
                    hover:text-pink-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Confirmar Senha</label>
              <div className="relative group/input">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400 
                  drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-black/50 border-2 border-orange-500/50 rounded-xl 
                    focus:border-orange-400 focus:shadow-[0_0_20px_rgba(251,146,60,0.4)] 
                    focus:outline-none transition-all duration-300 text-white placeholder:text-white/40
                    hover:border-orange-400/70"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 
                    hover:text-orange-300 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !supabaseConfigured}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 
                hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500
                shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.8)]
                transition-all duration-300 py-3 text-white font-bold text-lg
                border-2 border-purple-400/50 hover:border-purple-300
                hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando conta...
                </span>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Já tem uma conta?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold 
                  drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all"
                disabled={loading}
              >
                Fazer login
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-white/20">
            <button
              onClick={() => router.push('/')}
              disabled={loading}
              className="w-full border-2 border-green-500/50 text-white font-semibold
                hover:bg-green-500/20 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]
                transition-all duration-300 px-4 py-3 rounded-xl
                hover:scale-[1.02]
                disabled:opacity-50"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
