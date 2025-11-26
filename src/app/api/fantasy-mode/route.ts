import { NextRequest, NextResponse } from 'next/server';
import { fantasyMode } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, userInput, tone, intensity } = body;

    if (!scenario || !userInput) {
      return NextResponse.json(
        { error: 'Cenário e entrada do usuário são obrigatórios' },
        { status: 400 }
      );
    }

    const response = await fantasyMode({
      scenario,
      userInput,
      tone: tone || 'romantic',
      intensity: intensity || 'moderate',
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Erro no Modo Fantasia' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: response.response,
    });
  } catch (error) {
    console.error('Erro na API do Modo Fantasia:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
