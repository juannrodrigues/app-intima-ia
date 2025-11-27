import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export async function POST(request: NextRequest) {
  try {
    const { messages, settings } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      );
    }

    // Chamar a API da OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.8,
      max_tokens: 300,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const aiMessage = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
