import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyStory } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Recebendo requisição de geração de fantasia...');

    const { scenarioId, previousStory, choice, isPremium, isFirstSegment } = await request.json();

    if (!scenarioId) {
      console.error('❌ Cenário não especificado');
      return NextResponse.json(
        { error: 'Cenário não especificado' },
        { status: 400 }
      );
    }

    console.log('✅ Gerando história para cenário:', scenarioId);

    const result = await generateFantasyStory({
      scenarioId,
      previousStory,
      choice,
      isPremium,
      isFirstSegment
    });

    if (!result.success) {
      console.error('❌ Erro ao gerar história:', result.error);
      return NextResponse.json(
        {
          error: 'Erro ao gerar história',
          details: result.error || 'Erro desconhecido',
          hint: 'Verifique se a API Key da OpenAI está configurada corretamente'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ story: result.story });
  } catch (error: any) {
    console.error('❌ Erro na API de geração de fantasia:', error);
    console.error('📋 Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error?.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}