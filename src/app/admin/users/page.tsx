'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { Card } from '@/components/custom/Card';
import {
  ChevronLeft,
  Users,
  Search,
  Filter,
  MoreVertical,
  Crown,
  Zap,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  created_at: string;
  plan_type: 'free' | 'premium';
  total_messages: number;
  last_login: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user || (user.email !== 'admin@intimaia.com' && user.email !== 'adm@intimaia.com')) {
      router.push('/dashboard');
      return;
    }
    loadUsers();
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Mock data para demonstração
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          created_at: '2024-01-15T10:30:00Z',
          plan_type: 'free',
          total_messages: 45,
          last_login: '2024-01-20T14:30:00Z',
        },
        {
          id: '2',
          email: 'user2@example.com',
          created_at: '2024-01-10T09:15:00Z',
          plan_type: 'premium',
          total_messages: 234,
          last_login: '2024-01-21T16:45:00Z',
        },
        {
          id: '3',
          email: 'user3@example.com',
          created_at: '2024-01-18T11:20:00Z',
          plan_type: 'free',
          total_messages: 12,
          last_login: '2024-01-19T10:10:00Z',
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.plan_type === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-pulse" />
          <p className="text-white/60">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
              <p className="text-sm text-white/60">
                Administre contas e permissões
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:border-[#9B4DFF] focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Todos', count: users.length },
              { key: 'free', label: 'Gratuito', count: users.filter(u => u.plan_type === 'free').length },
              { key: 'premium', label: 'Premium', count: users.filter(u => u.plan_type === 'premium').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === key
                    ? 'bg-[#9B4DFF] text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white/5 border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.email}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>
                        Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span>
                        Último login: {new Date(user.last_login).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user.plan_type === 'premium' ? (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Zap className="w-4 h-4 text-blue-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      user.plan_type === 'premium' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {user.plan_type === 'premium' ? 'Premium' : 'Gratuito'}
                    </span>
                  </div>
                  <div className="text-sm text-white/60">
                    {user.total_messages} mensagens
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-white/60">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
