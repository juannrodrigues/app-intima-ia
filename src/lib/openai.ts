import OpenAI from 'openai';

// Verifica se a API Key está configurada
if (!process.env.OPENAI_API_KEY) {
  console.error('⚠️ OPENAI_API_KEY não está configurada no .env.local');
}

// Inicializa o cliente OpenAI
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurações padrão
export const DEFAULT_MODEL = 'gpt-4o';
export const DEFAULT_TEMPERATURE = 0.8;
export const DEFAULT_MAX_TOKENS = 500;

// Tipos para as funcionalidades
export interface ChatCompletionParams {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ImageAnalysisParams {
  imageUrl: string;
  prompt?: string;
  model?: string;
}

export interface MessageGenerationParams {
  context: string;
  tone: string;
  intensity: string;
  language: string;
}

export interface ConversationAnalysisParams {
  messages: string[];
  analysisType: 'sentiment' | 'suggestions' | 'summary';
}

export interface FantasyModeParams {
  scenario: string;
  userInput: string;
  tone: string;
  intensity: string;
}

export interface GenerateMessagesParams {
  situation: string;
}

export interface GenerateFantasyParams {
  scenarioId: string;
  previousStory?: string;
  choice?: string;
  isPremium: boolean;
  isFirstSegment: boolean;
}

// Função para chat com a IA
export async function chatWithAI(params: ChatCompletionParams) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    console.log('🤖 Chamando OpenAI API...');

    const response = await openai.chat.completions.create({
      model: params.model || DEFAULT_MODEL,
      messages: params.messages,
      temperature: params.temperature || DEFAULT_TEMPERATURE,
      max_tokens: params.max_tokens || DEFAULT_MAX_TOKENS,
    });

    const messageContent = response.choices[0]?.message?.content;

    if (!messageContent) {
      throw new Error('Resposta vazia da OpenAI');
    }

    console.log('✅ Resposta recebida da OpenAI');

    return {
      success: true,
      message: messageContent,
      usage: response.usage,
    };
  } catch (error: any) {
    console.error('❌ Erro ao chamar OpenAI:', error);
    console.error('📋 Detalhes do erro:', error?.message, error?.status);

    // Tratamento específico de erros da OpenAI
    if (error?.status === 401) {
      return {
        success: false,
        message: '',
        error: 'Erro de autenticação. Verifique sua API Key da OpenAI.',
      };
    }

    if (error?.status === 429) {
      return {
        success: false,
        message: '',
        error: 'Limite de requisições atingido. Tente novamente em alguns instantes.',
      };
    }

    if (error?.status === 500) {
      return {
        success: false,
        message: '',
        error: 'Erro no servidor da OpenAI. Tente novamente.',
      };
    }

    if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: '',
        error: 'Erro de conexão com a OpenAI. Verifique sua internet.',
      };
    }

    return {
      success: false,
      message: '',
      error: error instanceof Error ? error.message : 'Erro desconhecido ao processar sua mensagem',
    };
  }
}

// Função para analisar imagens
export async function analyzeImage(params: ImageAnalysisParams) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    const response = await openai.chat.completions.create({
      model: params.model || 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                params.prompt ||
                'Analise esta imagem e descreva o que você vê de forma detalhada e sensual, mantendo o respeito.',
            },
            {
              type: 'image_url',
              image_url: {
                url: params.imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return {
      success: true,
      analysis: response.choices[0]?.message?.content || '',
    };
  } catch (error: any) {
    console.error('Erro ao analisar imagem:', error);
    return {
      success: false,
      analysis: 'Não foi possível analisar a imagem.',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para gerar mensagens prontas
export async function generateReadyMessage(params: MessageGenerationParams) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    const systemPrompt = `Você é um assistente especializado em criar mensagens ${params.tone} com intensidade ${params.intensity}. 
Crie mensagens criativas, envolventes e personalizadas em ${params.language}.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Crie uma mensagem baseada neste contexto: ${params.context}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    return {
      success: true,
      message: response.choices[0]?.message?.content || '',
    };
  } catch (error: any) {
    console.error('Erro ao gerar mensagem:', error);
    return {
      success: false,
      message: 'Não foi possível gerar a mensagem.',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para gerar múltiplas mensagens para uma situação
export async function generateMessagesForSituation(params: GenerateMessagesParams) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    console.log('📝 Gerando mensagens para situação:', params.situation);

    const systemPrompt = `Você é um especialista em comunicação romântica e social, inclusivo para todos os gêneros e orientações.
Sua missão é criar mensagens autênticas, criativas e adequadas para qualquer tipo de relacionamento.

IMPORTANTE:
- Seja inclusivo: adapte a linguagem para qualquer gênero/orientação
- Crie mensagens naturais, não robotizadas
- Varie o tom: pode ser fofo, ousado, engraçado, romântico, etc
- Mensagens CURTAS (máximo 2-3 linhas cada)
- Evite clichês óbvios
- Seja autêntico e moderno

Retorne APENAS um objeto JSON válido com este formato exato (sem markdown, sem explicações):
{"messages": ["mensagem 1", "mensagem 2", "mensagem 3"]}`;

    const userPrompt = `Situação: ${params.situation}

Gere 3 opções de mensagens curtas e criativas para essa situação. Retorne APENAS o JSON.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const responseText = response.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('Resposta vazia da OpenAI');
    }

    console.log('✅ Resposta recebida da OpenAI');

    // Limpa a resposta
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }
    cleanedResponse = cleanedResponse.trim();

    console.log('🧹 Resposta limpa');

    // Parse do JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError: any) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      console.error('📄 Conteúdo que falhou:', cleanedResponse);

      // Fallback: tenta extrair mensagens manualmente
      const messageMatches = cleanedResponse.match(/"([^"]+)"/g);
      if (messageMatches && messageMatches.length >= 3) {
        const extractedMessages = messageMatches
          .slice(0, 3)
          .map(m => m.replace(/"/g, ''));

        console.log('✅ Mensagens extraídas manualmente:', extractedMessages);

        return {
          success: true,
          messages: extractedMessages,
          usage: response.usage,
        };
      }

      throw new Error(`Formato de resposta inválido: ${parseError.message}`);
    }

    if (!parsedResponse.messages || !Array.isArray(parsedResponse.messages)) {
      console.error('❌ Formato inválido:', parsedResponse);
      throw new Error('Formato de resposta inválido - esperado array de mensagens');
    }

    // Garante que temos exatamente 3 mensagens
    const messages = parsedResponse.messages.slice(0, 3);

    if (messages.length === 0) {
      throw new Error('Nenhuma mensagem foi gerada');
    }

    console.log('✅ Mensagens geradas com sucesso!', messages);

    return {
      success: true,
      messages,
      usage: response.usage,
    };
  } catch (error: any) {
    console.error('❌ Erro ao gerar mensagens:', error);
    return {
      success: false,
      messages: [],
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para analisar conversas
export async function analyzeConversation(params: ConversationAnalysisParams) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    const analysisPrompts = {
      sentiment:
        'Analise o sentimento geral desta conversa e forneça insights sobre o tom emocional.',
      suggestions:
        'Analise esta conversa e forneça sugestões de como melhorar a comunicação e criar mais conexão.',
      summary: 'Faça um resumo desta conversa destacando os pontos principais.',
    };

    const conversationText = params.messages.join('\n\n');

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Você é um especialista em análise de conversas românticas e relacionamentos.',
        },
        {
          role: 'user',
          content: `${analysisPrompts[params.analysisType]}\n\nConversa:\n${conversationText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return {
      success: true,
      analysis: response.choices[0]?.message?.content || '',
    };
  } catch (error: any) {
    console.error('Erro ao analisar conversa:', error);
    return {
      success: false,
      analysis: 'Não foi possível analisar a conversa.',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para gerar histórias de fantasia interativas
export async function generateFantasyStory(params: GenerateFantasyParams) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    const scenarioPrompts: Record<string, string> = {
      car: 'um encontro íntimo e apaixonado dentro de um carro estacionado em um lugar privado e romântico',
      hotel: 'uma noite luxuosa e sensual em um quarto de hotel sofisticado com champanhe e atmosfera romântica',
      distance: 'uma conexão intensa e provocante através de mensagens e chamadas à distância',
      beach: 'um encontro romântico e apaixonado em uma praia deserta sob o luar',
      home: 'um momento íntimo e confortável em casa, sem pressa, explorando a conexão',
      surprise: 'um encontro inesperado e surpreendente que transforma a relação'
    };

    const scenarioDescription = scenarioPrompts[params.scenarioId] || scenarioPrompts.car;
    console.log('✅ Gerando história para cenário:', params.scenarioId);

    let prompt = '';

    if (params.isFirstSegment) {
      // Primeira cena
      if (params.isPremium) {
        prompt = `Crie o início de uma história interativa romântica e sensual sobre ${scenarioDescription}.

IMPORTANTE:
- Escreva em português brasileiro
- Use linguagem elegante, sugestiva mas não explícita
- Crie tensão e química entre os personagens
- Seja inclusivo quanto a gêneros e orientações
- Termine em um ponto de escolha interessante
- A história deve ter aproximadamente 200-250 palavras

Retorne APENAS um objeto JSON válido com este formato exato (sem markdown, sem explicações):
{
  "text": "texto da história aqui",
  "choices": ["Opção 1", "Opção 2", "Opção 3"]
}`;
      } else {
        // Versão free - cena curta e completa
        prompt = `Crie uma cena curta, completa e envolvente sobre ${scenarioDescription}.

IMPORTANTE:
- Escreva em português brasileiro
- Use linguagem elegante, sugestiva mas não explícita
- Crie tensão e química entre os personagens
- Seja inclusivo quanto a gêneros e orientações
- A cena deve ser completa (início, meio e fim satisfatório)
- Aproximadamente 150-180 palavras
- NÃO inclua escolhas (é uma cena única do plano free)

Retorne APENAS um objeto JSON válido com este formato exato (sem markdown, sem explicações):
{
  "text": "texto da história completa aqui",
  "choices": []
}`;
      }
    } else {
      // Continuação da história (apenas Premium)
      prompt = `Continue esta história interativa baseada na escolha do usuário.

HISTÓRIA ANTERIOR:
${params.previousStory}

ESCOLHA DO USUÁRIO: ${params.choice}

IMPORTANTE:
- Continue naturalmente a partir da escolha
- Mantenha o tom romântico e sensual
- Desenvolva a tensão e química
- Seja inclusivo quanto a gêneros e orientações
- Termine em um novo ponto de escolha
- Aproximadamente 200-250 palavras

Retorne APENAS um objeto JSON válido com este formato exato (sem markdown, sem explicações):
{
  "text": "continuação da história aqui",
  "choices": ["Opção 1", "Opção 2", "Opção 3"]
}`;
    }

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Você é um escritor especializado em histórias românticas e sensuais interativas. Suas histórias são elegantes, envolventes e respeitosas, criando tensão e química sem ser explícito. Você sempre responde em JSON válido sem markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const responseText = response.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('Resposta vazia da OpenAI');
    }

    console.log('✅ Resposta recebida da OpenAI');

    // Limpa a resposta
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }
    cleanedResponse = cleanedResponse.trim();

    console.log('🧹 Resposta limpa');

    // Parse do JSON
    let story;
    try {
      story = JSON.parse(cleanedResponse);
    } catch (parseError: any) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      console.error('📄 Conteúdo que falhou:', cleanedResponse);

      // Fallback
      story = {
        text: 'Desculpe, houve um erro ao gerar a história. Por favor, tente novamente.',
        choices: []
      };
    }

    // Valida estrutura
    if (!story.text) {
      console.error('❌ Formato inválido: falta campo "text"');
      story.text = 'Erro ao gerar história. Tente novamente.';
    }

    if (!Array.isArray(story.choices)) {
      console.warn('⚠️ Campo "choices" não é array, corrigindo...');
      story.choices = [];
    }

    console.log('✅ História gerada com sucesso!');

    return {
      success: true,
      story,
      usage: response.usage,
    };
  } catch (error: any) {
    console.error('❌ Erro ao gerar história:', error);
    return {
      success: false,
      story: {
        text: 'Erro ao gerar história. Tente novamente.',
        choices: []
      },
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para Modo Fantasia (roleplay guiado)
export async function fantasyMode(params: FantasyModeParams) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    const systemPrompt = `Você está no Modo Fantasia, criando uma experiência de roleplay ${params.tone} com intensidade ${params.intensity}.
Seja criativo, envolvente e mantenha a narrativa fluindo naturalmente.
Cenário: ${params.scenario}`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: params.userInput },
      ],
      temperature: 0.9,
      max_tokens: 600,
    });

    return {
      success: true,
      response: response.choices[0]?.message?.content || '',
    };
  } catch (error: any) {
    console.error('Erro no Modo Fantasia:', error);
    return {
      success: false,
      response: 'Não foi possível continuar a fantasia.',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}