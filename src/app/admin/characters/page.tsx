'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { Card } from '@/components/custom/Card';
import {
  ChevronLeft,
  Edit,
  Plus,
  Trash2,
  Crown,
  Lock,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  is_premium: boolean;
  gender: string;
}

export default function AdminCharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

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
    loadCharacters();
  };

  const loadCharacters = async () => {
    setLoading(true);
    try {
      // Mock data para demonstração
      const mockCharacters: Character[] = [
        {
          id: '1',
          name: 'Sofia',
          avatar: '👩‍🦰',
          personality: 'Carinhosa e divertida',
          is_premium: false,
          gender: 'female',
        },
        {
          id: '2',
          name: 'Luna',
          avatar: '🌙',
          personality: 'Misteriosa e sedutora',
          is_premium: true,
          gender: 'female',
        },
        {
          id: '3',
          name: 'Alex',
          avatar: '👨',
          personality: 'Confiante e protetor',
          is_premium: false,
          gender: 'male',
        },
      ];
      setCharacters(mockCharacters);
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (characterId: string) => {
    // Implementar edição
    alert(`Editar personagem ${characterId}`);
  };

  const handleDelete = (characterId: string) => {
    // Implementar exclusão
    if (confirm('Tem certeza que deseja excluir este personagem?')) {
      setCharacters(characters.filter(c => c.id !== characterId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <Edit className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-pulse" />
          <p className="text-white/60">Carregando personagens...</p>
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
              <h1 className="text-2xl font-bold">Gerenciar Personagens</h1>
              <p className="text-sm text-white/60">
                Edite e gerencie os personagens do app
              </p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Personagem
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Card key={character.id} className="bg-white/5 border-white/10">
              <div className="text-center">
                <div className="text-6xl mb-4">{character.avatar}</div>
                <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                <p className="text-white/80 mb-2">{character.personality}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {character.is_premium && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Premium</span>
                    </div>
                  )}
                  <span className="text-xs text-white/50">
                    {character.gender === 'female' && '♀️ Feminino'}
                    {character.gender === 'male' && '♂️ Masculino'}
                    {character.gender === 'non-binary' && '⚧️ Não-binário'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(character.id)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(character.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
