import { NextRequest, NextResponse } from 'next/server';
import { generateMessagesForSituation } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Recebendo requisição de geração de mensagens...');

    const body = await request.json();
    const { situation } = body;

    if (!situation) {
      console.error('❌ Situação não fornecida');
      return NextResponse.json(
        { error: 'Situação é obrigatória' },
        { status: 400 }
      );
    }

    console.log('✅ Gerando mensagens para situação:', situation);

    const result = await generateMessagesForSituation({ situation });

    if (!result.success) {
      console.error('❌ Erro ao gerar mensagens:', result.error);
      return NextResponse.json(
        {
          error: 'Erro ao gerar mensagens',
          details: result.error || 'Erro desconhecido',
          hint: 'Verifique se a API Key da OpenAI está configurada corretamente'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages: result.messages,
      usage: result.usage,
    });
  } catch (error: any) {
    console.error('❌ Erro na API de geração de mensagens:', error);
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