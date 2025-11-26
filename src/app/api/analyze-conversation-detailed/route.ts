import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationText, isPremium } = body;

    if (!conversationText || typeof conversationText !== 'string') {
      return NextResponse.json(
        { error: 'Texto da conversa é obrigatório' },
        { status: 400 }
      );
    }

    // Limite para plano free
    const FREE_PLAN_LIMIT = 500;
    if (!isPremium && conversationText.length > FREE_PLAN_LIMIT) {
      return NextResponse.json(
        { error: 'Limite de caracteres excedido para o plano gratuito' },
        { status: 403 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API Key da OpenAI não configurada' },
        { status: 500 }
      );
    }

    console.log('🔍 Analisando conversa...');

    // Prompt estruturado para análise completa
    const systemPrompt = `Você é um especialista em análise de conversas românticas e relacionamentos. 
Analise a conversa fornecida e retorne um JSON estruturado com as seguintes informações:

{
  "interestLevel": {
    "score": número de 0 a 100,
    "description": "descrição detalhada do nível de interesse",
    "indicators": ["indicador 1", "indicador 2", "indicador 3"]
  },
  "emotionalTone": {
    "primary": "tom emocional principal",
    "secondary": ["tom secundário 1", "tom secundário 2"],
    "description": "descrição do tom emocional geral"
  },
  "meaning": {
    "summary": "resumo do que a pessoa quis dizer",
    "hiddenMessages": ["mensagem oculta 1", "mensagem oculta 2"]
  },
  "ghostingRisk": {
    "level": "baixo" | "médio" | "alto",
    "percentage": número de 0 a 100,
    "reasons": ["razão 1", "razão 2", "razão 3"]
  },
  "suggestedResponse": {
    "message": "sugestão de resposta pronta",
    "tone": "tom recomendado",
    "tips": ["dica 1", "dica 2", "dica 3"]
  }
}

Seja específico, perspicaz e forneça insights valiosos. Use linguagem brasileira natural.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Analise esta conversa:\n\n${conversationText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const analysisText = response.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('Resposta vazia da OpenAI');
    }

    console.log('✅ Análise concluída');

    const analysis = JSON.parse(analysisText);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('❌ Erro ao analisar conversa:', error);

    // Tratamento de erros específicos da OpenAI
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Erro de autenticação com a OpenAI' },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Limite de requisições atingido. Tente novamente em alguns instantes.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao analisar conversa. Tente novamente!' },
      { status: 500 }
    );
  }
}
