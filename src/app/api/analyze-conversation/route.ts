import { NextRequest, NextResponse } from 'next/server';
import { analyzeConversation } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, analysisType } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens são obrigatórias' },
        { status: 400 }
      );
    }

    if (!['sentiment', 'suggestions', 'summary'].includes(analysisType)) {
      return NextResponse.json(
        { error: 'Tipo de análise inválido' },
        { status: 400 }
      );
    }

    const response = await analyzeConversation({
      messages,
      analysisType,
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Erro ao analisar conversa' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysis: response.analysis,
    });
  } catch (error) {
    console.error('Erro na API de análise de conversa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
