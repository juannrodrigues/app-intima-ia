'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sun, Moon, Heart, Star } from 'lucide-react';

const characters = [
  {
    id: 1,
    name: 'Luna',
    description: 'Misteriosa e sedutora',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    personality: 'Carismática e envolvente'
  },
  {
    id: 2,
    name: 'Max',
    description: 'Confiante e charmoso',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    personality: 'Aventureiro e apaixonado'
  },
  {
    id: 3,
    name: 'Bella',
    description: 'Doce e sensual',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    personality: 'Romântica e atenciosa'
  },
  {
    id: 4,
    name: 'Oliver',
    description: 'Inteligente e sedutor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    personality: 'Sofisticado e intenso'
  }
];

export default function CharactersPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.classList.toggle('light', savedTheme === 'light');

    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter) {
      setSelectedCharacter(parseInt(savedCharacter));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const handleSelectCharacter = (id: number) => {
    setSelectedCharacter(id);
    localStorage.setItem('selectedCharacter', id.toString());
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white' : 'bg-gradient-to-br from-[#F5E6D3] via-[#E8D4B8] to-[#F5E6D3] text-gray-800'} transition-all duration-500`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-white/10 bg-black/30' : 'border-gray-300 bg-white/30'} backdrop-blur-sm sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push('/profile')}
              variant="ghost"
              className={`${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-200'}`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            
            <button
              onClick={toggleTheme}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200'
              }`}
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
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Escolha seu Personagem
          </h1>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-lg`}>
            Selecione o personagem que mais combina com você
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Card
              key={character.id}
              onClick={() => handleSelectCharacter(character.id)}
              className={`${
                selectedCharacter === character.id
                  ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.6)]'
                  : theme === 'dark'
                    ? 'bg-white/5 border-2 border-white/10 hover:border-purple-500/50'
                    : 'bg-white/80 border-2 border-gray-300 hover:border-purple-500/50'
              } p-6 cursor-pointer transition-all hover:scale-105`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-400">
                    <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                  </div>
                  {selectedCharacter === character.id && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {character.name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mt-1`}>
                    {character.description}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'} mt-2`}>
                    {character.personality}
                  </p>
                </div>

                {selectedCharacter === character.id && (
                  <div className="flex items-center gap-1 text-purple-400 text-sm font-semibold">
                    <Heart className="w-4 h-4 fill-purple-400" />
                    Selecionado
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push('/profile')}
            className={`${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900' : 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700'} text-white px-8 py-6 text-lg`}
          >
            Confirmar Seleção
          </Button>
        </div>
      </div>
    </div>
  );
}
