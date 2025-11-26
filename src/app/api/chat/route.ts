import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, settings } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: settings.intensity === 'hot' ? 0.9 : settings.intensity === 'moderate' ? 0.7 : 0.5,
        max_tokens: 300,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('Erro na API da OpenAI');
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
