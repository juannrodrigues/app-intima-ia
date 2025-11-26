'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Redirecionar para dashboard após cadastro
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-sm p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2f1aed9e-25f8-4188-aa58-2281b1763c99.webp"
              alt="Intima IA Logo"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] bg-clip-text text-transparent">
              Intima IA
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Criar conta</h1>
          <p className="text-white/60">Junte-se a nós e comece suas conversas</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:border-[#9B4DFF] focus:outline-none transition-colors text-white"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/10 rounded-xl focus:border-[#9B4DFF] focus:outline-none transition-colors text-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/10 rounded-xl focus:border-[#9B4DFF] focus:outline-none transition-colors text-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] hover:shadow-[0_0_20px_rgba(155,77,255,0.5)] py-3"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Já tem uma conta?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-[#9B4DFF] hover:text-[#8B3DFF] font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => router.push('/')}
            className="w-full border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30
              transition-all duration-300 px-4 py-2 rounded-md font-medium"
          >
            Voltar ao início
          </button>
        </div>
      </Card>
    </div>
  );
}
