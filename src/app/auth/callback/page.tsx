'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient();
        
        // Verifica se há um usuário autenticado
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Erro no callback:', error);
          router.push('/login?error=auth_failed');
          return;
        }

        if (user) {
          // Usuário autenticado com sucesso, redireciona para o dashboard
          router.push('/dashboard');
        } else {
          // Sem usuário, volta para login
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/80 text-lg">Finalizando autenticação...</p>
        <p className="text-white/60 text-sm mt-2">Você será redirecionado em instantes</p>
      </div>
    </div>
  );
}
