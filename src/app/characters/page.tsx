'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { Card } from '@/components/custom/Card';
import {
  ChevronLeft,
  Heart,
  Lock,
  Crown,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  description: string;
  tone_default: string;
  intensity_default: string;
  is_premium: boolean;
  isFavorite?: boolean;
  gender: 'female' | 'male' | 'non-binary';
  neonColor: 'green' | 'orange' | 'pink' | 'yellow';
}

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [planType, setPlanType] = useState<'free' | 'premium'>('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'female' | 'male' | 'non-binary'>('all');
  const userId = 'user_demo_123';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError('Banco de dados não configurado. Configure suas credenciais do Supabase.');
      setLoading(false);
      // Carrega personagens de exemplo
      loadMockCharacters();
      return;
    }

    try {
      await Promise.all([loadCharacters(), loadFavorites()]);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar personagens. Usando dados de exemplo.');
      loadMockCharacters();
    } finally {
      setLoading(false);
    }
  };

  const loadMockCharacters = () => {
    const mockCharacters: Character[] = [
      // FEMININO - FREE (6 personagens)
      {
        id: 'f1',
        name: 'Aurora',
        avatar: '👩‍🦰',
        personality: 'Carinhosa e acolhedora',
        description: 'Uma alma gentil que ilumina seus dias com ternura e compreensão',
        tone_default: 'romantic',
        intensity_default: 'light',
        is_premium: false,
        gender: 'female',
        neonColor: 'pink',
      },
      {
        id: 'f2',
        name: 'Valentina',
        avatar: '👩‍🎨',
        personality: 'Criativa e inspiradora',
        description: 'Artista apaixonada que transforma momentos em obras de arte',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'female',
        neonColor: 'yellow',
      },
      {
        id: 'f3',
        name: 'Bianca',
        avatar: '👩‍⚕️',
        personality: 'Cuidadosa e empática',
        description: 'Sempre presente para cuidar de você com dedicação e carinho',
        tone_default: 'shy',
        intensity_default: 'light',
        is_premium: false,
        gender: 'female',
        neonColor: 'green',
      },
      {
        id: 'f4',
        name: 'Camila',
        avatar: '👩‍🏫',
        personality: 'Inteligente e paciente',
        description: 'Adora ensinar e aprender junto, criando conexões profundas',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'female',
        neonColor: 'orange',
      },
      {
        id: 'f5',
        name: 'Daniela',
        avatar: '👩‍🌾',
        personality: 'Natural e autêntica',
        description: 'Simples e verdadeira, conectada com a essência da vida',
        tone_default: 'shy',
        intensity_default: 'light',
        is_premium: false,
        gender: 'female',
        neonColor: 'green',
      },
      {
        id: 'f6',
        name: 'Luna',
        avatar: '👩‍🎤',
        personality: 'Misteriosa e encantadora',
        description: 'Como a lua, ilumina a noite com seu brilho único e fascinante',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'female',
        neonColor: 'pink',
      },

      // FEMININO - PREMIUM (6 personagens)
      {
        id: 'f7',
        name: 'Scarlett',
        avatar: '👩‍🦱',
        personality: 'Sedutora e misteriosa',
        description: 'Envolvente como a noite, revela seus segredos aos poucos',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'female',
        neonColor: 'pink',
      },
      {
        id: 'f8',
        name: 'Anastasia',
        avatar: '👸',
        personality: 'Elegante e sofisticada',
        description: 'Realeza em pessoa, com classe e refinamento incomparáveis',
        tone_default: 'dominant',
        intensity_default: 'moderate',
        is_premium: true,
        gender: 'female',
        neonColor: 'yellow',
      },
      {
        id: 'f9',
        name: 'Morgana',
        avatar: '🧙‍♀️',
        personality: 'Mística e encantadora',
        description: 'Possui um magnetismo sobrenatural que hipnotiza',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'female',
        neonColor: 'orange',
      },
      {
        id: 'f10',
        name: 'Elektra',
        avatar: '👩‍🎤',
        personality: 'Intensa e apaixonada',
        description: 'Vive cada momento com uma intensidade arrebatadora',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'female',
        neonColor: 'pink',
      },
      {
        id: 'f11',
        name: 'Celeste',
        avatar: '👩‍🚀',
        personality: 'Aventureira e ousada',
        description: 'Explora novos horizontes sem medo de arriscar',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'female',
        neonColor: 'green',
      },
      {
        id: 'f12',
        name: 'Pandora',
        avatar: '👩‍🔬',
        personality: 'Curiosa e provocante',
        description: 'Cada conversa abre uma nova caixa de possibilidades',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'female',
        neonColor: 'yellow',
      },

      // MASCULINO - FREE (6 personagens)
      {
        id: 'm1',
        name: 'Gabriel',
        avatar: '👨‍💼',
        personality: 'Confiável e protetor',
        description: 'Sempre presente quando você precisa, forte e decidido',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'male',
        neonColor: 'green',
      },
      {
        id: 'm2',
        name: 'Theo',
        avatar: '👨‍🎓',
        personality: 'Intelectual e charmoso',
        description: 'Conversas estimulantes que tocam a mente e o coração',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'male',
        neonColor: 'yellow',
      },
      {
        id: 'm3',
        name: 'Bruno',
        avatar: '👨‍🍳',
        personality: 'Atencioso e carinhoso',
        description: 'Cuida de cada detalhe para fazer você se sentir especial',
        tone_default: 'shy',
        intensity_default: 'light',
        is_premium: false,
        gender: 'male',
        neonColor: 'orange',
      },
      {
        id: 'm4',
        name: 'Felipe',
        avatar: '👨‍🎸',
        personality: 'Musical e romântico',
        description: 'Cada palavra é uma melodia que embala seu coração',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'male',
        neonColor: 'pink',
      },
      {
        id: 'm5',
        name: 'André',
        avatar: '👨‍🌾',
        personality: 'Simples e verdadeiro',
        description: 'Honesto e direto, valoriza as coisas genuínas da vida',
        tone_default: 'shy',
        intensity_default: 'light',
        is_premium: false,
        gender: 'male',
        neonColor: 'green',
      },
      {
        id: 'm6',
        name: 'Rafael',
        avatar: '👨‍⚕️',
        personality: 'Cuidadoso e dedicado',
        description: 'Sempre atento aos detalhes, cuida com carinho e atenção',
        tone_default: 'romantic',
        intensity_default: 'light',
        is_premium: false,
        gender: 'male',
        neonColor: 'yellow',
      },

      // MASCULINO - PREMIUM (6 personagens)
      {
        id: 'm7',
        name: 'Maximus',
        avatar: '🤴',
        personality: 'Dominante e confiante',
        description: 'Líder nato que sabe exatamente o que quer e como conseguir',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'male',
        neonColor: 'orange',
      },
      {
        id: 'm8',
        name: 'Dante',
        avatar: '👨‍🎨',
        personality: 'Passional e intenso',
        description: 'Vive cada emoção com profundidade e paixão avassaladora',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'male',
        neonColor: 'pink',
      },
      {
        id: 'm9',
        name: 'Ares',
        avatar: '🦸‍♂️',
        personality: 'Forte e destemido',
        description: 'Guerreiro corajoso que enfrenta qualquer desafio',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'male',
        neonColor: 'yellow',
      },
      {
        id: 'm10',
        name: 'Loki',
        avatar: '🎭',
        personality: 'Enigmático e sedutor',
        description: 'Mestre da sedução com um toque de mistério irresistível',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'male',
        neonColor: 'green',
      },
      {
        id: 'm11',
        name: 'Orion',
        avatar: '👨‍🚀',
        personality: 'Aventureiro e ousado',
        description: 'Explora o desconhecido com coragem e determinação',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'male',
        neonColor: 'orange',
      },
      {
        id: 'm12',
        name: 'Draco',
        avatar: '🧙‍♂️',
        personality: 'Misterioso e poderoso',
        description: 'Possui um magnetismo obscuro que fascina e atrai',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'male',
        neonColor: 'pink',
      },

      // NÃO-BINÁRIO - FREE (6 personagens)
      {
        id: 'nb1',
        name: 'Sage',
        avatar: '🌿',
        personality: 'Sábio e equilibrado',
        description: 'Traz harmonia e sabedoria para cada conversa',
        tone_default: 'romantic',
        intensity_default: 'light',
        is_premium: false,
        gender: 'non-binary',
        neonColor: 'green',
      },
      {
        id: 'nb2',
        name: 'Rain',
        avatar: '🌧️',
        personality: 'Fluido e adaptável',
        description: 'Como a chuva, se adapta naturalmente a cada momento',
        tone_default: 'shy',
        intensity_default: 'light',
        is_premium: false,
        gender: 'non-binary',
        neonColor: 'yellow',
      },
      {
        id: 'nb3',
        name: 'Ash',
        avatar: '🌫️',
        personality: 'Misterioso e intrigante',
        description: 'Envolve você em uma névoa de possibilidades infinitas',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'non-binary',
        neonColor: 'pink',
      },
      {
        id: 'nb4',
        name: 'River',
        avatar: '🌊',
        personality: 'Tranquilo e profundo',
        description: 'Flui naturalmente, sempre encontrando seu caminho',
        tone_default: 'shy',
        intensity_default: 'light',
        is_premium: false,
        gender: 'non-binary',
        neonColor: 'green',
      },
      {
        id: 'nb5',
        name: 'Sky',
        avatar: '☁️',
        personality: 'Livre e inspirador',
        description: 'Sem limites, sempre aberto a novas possibilidades',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'non-binary',
        neonColor: 'yellow',
      },
      {
        id: 'nb6',
        name: 'Phoenix',
        avatar: '🔥',
        personality: 'Transformador e resiliente',
        description: 'Renasce das cinzas, sempre mais forte e radiante',
        tone_default: 'romantic',
        intensity_default: 'moderate',
        is_premium: false,
        gender: 'non-binary',
        neonColor: 'orange',
      },

      // NÃO-BINÁRIO - PREMIUM (6 personagens)
      {
        id: 'nb7',
        name: 'Nebula',
        avatar: '🌌',
        personality: 'Cósmico e transcendental',
        description: 'Conecta dimensões e expande horizontes além do imaginável',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'non-binary',
        neonColor: 'orange',
      },
      {
        id: 'nb8',
        name: 'Ember',
        avatar: '🔥',
        personality: 'Ardente e transformador',
        description: 'Queima barreiras e reacende paixões adormecidas',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'non-binary',
        neonColor: 'pink',
      },
      {
        id: 'nb9',
        name: 'Zephyr',
        avatar: '💨',
        personality: 'Livre e indomável',
        description: 'Como o vento, não pode ser contido ou definido',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'non-binary',
        neonColor: 'yellow',
      },
      {
        id: 'nb10',
        name: 'Prism',
        avatar: '🌈',
        personality: 'Multifacetado e vibrante',
        description: 'Reflete todas as cores da experiência humana',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'non-binary',
        neonColor: 'green',
      },
      {
        id: 'nb11',
        name: 'Eclipse',
        avatar: '🌑',
        personality: 'Enigmático e fascinante',
        description: 'Obscurece o comum e revela o extraordinário',
        tone_default: 'bold',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'non-binary',
        neonColor: 'pink',
      },
      {
        id: 'nb12',
        name: 'Aurora',
        avatar: '✨',
        personality: 'Mágico e deslumbrante',
        description: 'Ilumina o céu com cores que desafiam a imaginação',
        tone_default: 'dominant',
        intensity_default: 'hot',
        is_premium: true,
        gender: 'non-binary',
        neonColor: 'yellow',
      },
    ];
    setCharacters(mockCharacters);
  };

  const loadCharacters = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('is_premium', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCharacters(data);
      } else {
        loadMockCharacters();
      }
    } catch (error: any) {
      console.error('Erro ao carregar personagens:', error);
      throw error;
    }
  };

  const loadFavorites = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('user_favorite_characters')
        .select('character_id')
        .eq('user_id', userId);

      if (error) throw error;
      const favSet = new Set(data?.map((f) => f.character_id) || []);
      setFavorites(favSet);
    } catch (error: any) {
      console.error('Erro ao carregar favoritos:', error);
      // Não lança erro - favoritos são opcionais
    }
  };

  const toggleFavorite = async (characterId: string) => {
    if (!supabase) {
      console.warn('Supabase não configurado - favoritos não serão salvos');
      return;
    }

    try {
      if (favorites.has(characterId)) {
        await supabase
          .from('user_favorite_characters')
          .delete()
          .eq('user_id', userId)
          .eq('character_id', characterId);

        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(characterId);
          return newSet;
        });
      } else {
        await supabase
          .from('user_favorite_characters')
          .insert({ user_id: userId, character_id: characterId });

        setFavorites((prev) => new Set(prev).add(characterId));
      }
    } catch (error: any) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const selectCharacter = (character: Character) => {
    if (character.is_premium && planType === 'free') {
      setSelectedCharacter(character);
      return;
    }

    // Salva personagem selecionado e redireciona para o chat
    localStorage.setItem('selectedCharacter', JSON.stringify(character));
    router.push('/chat');
  };

  const filteredCharacters = characters.filter(char => 
    filter === 'all' || char.gender === filter
  );

  const getNeonClasses = (color: string) => {
    const neonStyles = {
      green: 'border-[3px] border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.7),0_0_40px_rgba(34,197,94,0.4),inset_0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,1),0_0_60px_rgba(34,197,94,0.6),inset_0_0_30px_rgba(34,197,94,0.25)] hover:border-green-300',
      orange: 'border-[3px] border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.7),0_0_40px_rgba(251,146,60,0.4),inset_0_0_20px_rgba(251,146,60,0.15)] hover:shadow-[0_0_30px_rgba(251,146,60,1),0_0_60px_rgba(251,146,60,0.6),inset_0_0_30px_rgba(251,146,60,0.25)] hover:border-orange-300',
      pink: 'border-[3px] border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.7),0_0_40px_rgba(244,114,182,0.4),inset_0_0_20px_rgba(244,114,182,0.15)] hover:shadow-[0_0_30px_rgba(244,114,182,1),0_0_60px_rgba(244,114,182,0.6),inset_0_0_30px_rgba(244,114,182,0.25)] hover:border-pink-300',
      yellow: 'border-[3px] border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7),0_0_40px_rgba(250,204,21,0.4),inset_0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_30px_rgba(250,204,21,1),0_0_60px_rgba(250,204,21,0.6),inset_0_0_30px_rgba(250,204,21,0.25)] hover:border-yellow-300',
    };
    return neonStyles[color as keyof typeof neonStyles] || neonStyles.green;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-pulse" />
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
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Personagens</h1>
              <p className="text-sm text-white/60">
                Escolha quem vai te acompanhar
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-200">{error}</p>
            </div>
          </div>
        )}

        {/* Premium Banner */}
        {planType === 'free' && (
          <Card className="mb-8 bg-gradient-to-r from-[#9B4DFF]/20 to-[#6A0DAD]/20 border-[#9B4DFF]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD]">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Desbloqueie Todos os Personagens
                  </h4>
                  <p className="text-white/60 text-sm">
                    Acesse personagens exclusivos com o plano Premium
                  </p>
                </div>
              </div>
              <Button onClick={() => router.push('/pricing')}>
                Ver Planos
              </Button>
            </div>
          </Card>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {[
            { key: 'all', label: 'Todos', count: characters.length },
            { key: 'female', label: 'Feminino', count: characters.filter(c => c.gender === 'female').length },
            { key: 'male', label: 'Masculino', count: characters.filter(c => c.gender === 'male').length },
            { key: 'non-binary', label: 'Não-binário', count: characters.filter(c => c.gender === 'non-binary').length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] text-white shadow-[0_0_20px_rgba(155,77,255,0.6)]'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => {
            const isFavorite = favorites.has(character.id);
            const isLocked = character.is_premium && planType === 'free';

            return (
              <div
                key={character.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isLocked ? 'opacity-75' : ''
                }`}
                onClick={() => selectCharacter(character)}
              >
                <Card
                  hover
                  className={`relative overflow-hidden bg-[#1A1A1A] transition-all duration-300 ${getNeonClasses(character.neonColor)}`}
                >
                  {/* Premium Badge */}
                  {character.is_premium && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Crown className="w-4 h-4" />
                        <span className="text-xs font-bold text-black">Premium</span>
                      </div>
                    </div>
                  )}

                  {/* Favorite Button */}
                  {isSupabaseConfigured() && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(character.id);
                      }}
                      className="absolute top-3 left-3 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  )}

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
                      <div className="text-center">
                        <Lock className="w-12 h-12 mx-auto mb-3 text-white/80" />
                        <p className="text-sm font-semibold mb-1">Premium</p>
                        <p className="text-xs text-white/60">Desbloqueie agora</p>
                      </div>
                    </div>
                  )}

                  {/* Character Content */}
                  <div className="text-center p-6">
                    <div className="text-7xl mb-4 transform transition-transform duration-300 hover:scale-110">
                      {character.avatar}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                    <p className="text-white/80 mb-2 font-medium">{character.personality}</p>
                    <p className="text-white/60 text-sm mb-4 leading-relaxed">
                      {character.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      <span className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium border border-white/20">
                        {character.tone_default === 'romantic' && '💕 Romântico'}
                        {character.tone_default === 'bold' && '🔥 Ousado'}
                        {character.tone_default === 'dominant' && '👑 Dominante'}
                        {character.tone_default === 'shy' && '🌙 Tímido'}
                      </span>
                      <span className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium border border-white/20">
                        {character.intensity_default === 'light' && '🌙 Leve'}
                        {character.intensity_default === 'moderate' && '🔥 Moderado'}
                        {character.intensity_default === 'hot' && '💥 Quente'}
                      </span>
                    </div>

                    {/* Gender Badge */}
                    <div className="text-xs text-white/50 font-medium">
                      {character.gender === 'female' && '♀️ Feminino'}
                      {character.gender === 'male' && '♂️ Masculino'}
                      {character.gender === 'non-binary' && '⚧️ Não-binário'}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCharacters.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum personagem encontrado
            </h3>
            <p className="text-white/60">
              Tente ajustar os filtros para ver mais opções
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
