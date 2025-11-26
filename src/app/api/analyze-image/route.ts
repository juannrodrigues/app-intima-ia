import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, prompt, tone, intensity } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    // Personaliza o prompt baseado no tom e intensidade
    const customPrompt =
      prompt ||
      `Analise esta imagem de forma ${tone || 'romântica'} com intensidade ${intensity || 'moderada'}. 
Seja descritivo, envolvente e mantenha o respeito. Foque em detalhes que criem conexão emocional.`;

    const response = await analyzeImage({
      imageUrl,
      prompt: customPrompt,
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Erro ao analisar imagem' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysis: response.analysis,
    });
  } catch (error) {
    console.error('Erro na API de análise de imagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
