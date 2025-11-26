import { NextRequest, NextResponse } from 'next/server';
import { generateReadyMessage } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context, tone, intensity, language } = body;

    if (!context) {
      return NextResponse.json(
        { error: 'Contexto é obrigatório' },
        { status: 400 }
      );
    }

    const response = await generateReadyMessage({
      context,
      tone: tone || 'romantic',
      intensity: intensity || 'moderate',
      language: language || 'pt-BR',
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Erro ao gerar mensagem' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: response.message,
    });
  } catch (error) {
    console.error('Erro na API de mensagens prontas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
