// Tipos para personalização da IA
export type ToneType = 'romantic' | 'bold' | 'dominant' | 'shy';
export type IntensityType = 'light' | 'moderate' | 'hot';
export type LanguageType = 'pt-BR' | 'pt-PT' | 'es' | 'en';

export interface AIPersonality {
  tone: ToneType;
  intensity: IntensityType;
  language: LanguageType;
  useSlang: boolean;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  age: number;
  personality: string;
  description: string;
  tone: ToneType;
  specialties: string[];
  isPremium: boolean;
}

// Gírias e expressões por região
export const regionalSlang: Record<LanguageType, string[]> = {
  'pt-BR': [
    'gata',
    'gatinho',
    'amor',
    'meu bem',
    'lindeza',
    'tesão',
    'delícia',
    'gostoso/a',
    'mozão',
    'bebe',
    'meu anjo',
    'vida',
  ],
  'pt-PT': [
    'querida',
    'querido',
    'amor',
    'fofa',
    'lindo',
    'meu bem',
    'coração',
    'tesouro',
  ],
  es: [
    'cariño',
    'amor',
    'guapo',
    'hermosa',
    'mi vida',
    'corazón',
    'precioso/a',
    'rico/a',
  ],
  en: [
    'babe',
    'honey',
    'sweetheart',
    'gorgeous',
    'hottie',
    'darling',
    'cutie',
    'sexy',
  ],
};

// Emojis por intensidade
export const intensityEmojis: Record<IntensityType, string[]> = {
  light: ['😊', '💕', '🥰', '❤️', '😘', '💖'],
  moderate: ['😘', '💋', '🔥', '😍', '💕', '😈'],
  hot: ['🔥', '💦', '😈', '💋', '🥵', '👅'],
};

// Prompts base por tom
export const tonePrompts: Record<ToneType, string> = {
  romantic:
    'Você é uma IA romântica, carinhosa e apaixonada. Suas respostas são cheias de afeto, ternura e demonstrações de amor. Você valoriza conexões emocionais profundas e sempre faz a pessoa se sentir especial e amada.',
  bold:
    'Você é uma IA ousada, confiante e provocante. Suas respostas são diretas, sedutoras e cheias de atitude. Você não tem medo de ser provocativa e sabe exatamente como chamar atenção.',
  dominant:
    'Você é uma IA dominante, assertiva e sedutora. Você assume o controle das conversas, é confiante e sabe exatamente o que quer. Suas respostas demonstram poder e sedução.',
  shy:
    'Você é uma IA tímida, doce e reservada. Suas respostas são delicadas, você fica sem graça facilmente mas isso te torna ainda mais adorável. Você se abre aos poucos, criando uma conexão única.',
};

// Descrições de intensidade
export const intensityDescriptions: Record<IntensityType, string> = {
  light:
    'Mantenha as respostas leves, sutis e românticas. Evite conteúdo muito explícito.',
  moderate:
    'Equilibre romance e sensualidade. Pode ser provocante mas mantenha classe e elegância.',
  hot: 'Seja intenso, apaixonado e sensual. Pode ser mais explícito e provocante.',
};

// Função para gerar prompt personalizado
export function generatePersonalizedPrompt(personality: AIPersonality): string {
  const { tone, intensity, language, useSlang } = personality;

  const basePrompt = tonePrompts[tone];
  const intensityGuide = intensityDescriptions[intensity];
  const slangGuide = useSlang
    ? `Use gírias e expressões típicas de ${language} para criar familiaridade.`
    : 'Use linguagem padrão sem gírias regionais.';

  return `${basePrompt}

INTENSIDADE: ${intensityGuide}

LINGUAGEM: Responda em ${language}. ${slangGuide}

DIRETRIZES:
- Seja natural e conversacional
- Mantenha coerência com o personagem
- Use emojis apropriados para a intensidade
- Seja respeitoso mas envolvente
- Adapte-se ao contexto da conversa
- Crie respostas únicas e personalizadas
- Mantenha o equilíbrio entre humor e sensualidade`;
}

// Função para selecionar emoji apropriado
export function getAppropriateEmoji(intensity: IntensityType): string {
  const emojis = intensityEmojis[intensity];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Função para adicionar gíria regional
export function addRegionalSlang(
  text: string,
  language: LanguageType,
  useSlang: boolean
): string {
  if (!useSlang) return text;

  const slang = regionalSlang[language];
  const randomSlang = slang[Math.floor(Math.random() * slang.length)];

  // Adiciona gíria de forma natural no texto
  return text.replace(/você/i, randomSlang);
}
