'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { Card } from '@/components/custom/Card';
import {
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  Heart,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Loader2,
  Image as ImageIcon,
  Crown,
} from 'lucide-react';

interface AnalysisResult {
  interestLevel: {
    score: number;
    description: string;
    indicators: string[];
  };
  emotionalTone: {
    primary: string;
    secondary: string[];
    description: string;
  };
  meaning: {
    summary: string;
    hiddenMessages: string[];
  };
  ghostingRisk: {
    level: 'baixo' | 'médio' | 'alto';
    percentage: number;
    reasons: string[];
  };
  suggestedResponse: {
    message: string;
    tone: string;
    tips: string[];
  };
}

export default function AnalysisPage() {
  const router = useRouter();
  const [conversationText, setConversationText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [isPremium] = useState(false); // Simula plano do usuário

  const FREE_PLAN_LIMIT = 500; // Limite de caracteres para plano free
  const characterCount = conversationText.length;
  const isOverLimit = !isPremium && characterCount > FREE_PLAN_LIMIT;

  const handleAnalyze = async () => {
    if (!conversationText.trim()) {
      setError('Por favor, cole o texto da conversa');
      return;
    }

    if (isOverLimit) {
      setError('Limite de caracteres excedido para o plano gratuito. Faça upgrade para Premium!');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-conversation-detailed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationText,
          isPremium,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar conversa');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (err) {
      console.error('Erro ao analisar:', err);
      setError('Não foi possível analisar a conversa. Tente novamente!');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = () => {
    // Funcionalidade futura: upload de prints
    alert('Funcionalidade de upload de imagens em breve! 📸');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'baixo':
        return 'text-green-400';
      case 'médio':
        return 'text-yellow-400';
      case 'alto':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const getInterestColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Análise de Conversas</h1>
              <p className="text-white/60 text-sm">Entenda o que seu crush realmente quis dizer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!analysisResult ? (
          <>
            {/* Input Section */}
            <Card className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Cole a Conversa</h2>
                  <p className="text-white/60 text-sm">
                    Cole o texto ou faça upload de prints
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={conversationText}
                    onChange={(e) => setConversationText(e.target.value)}
                    placeholder="Cole aqui o texto da conversa com seu crush...&#10;&#10;Exemplo:&#10;Você: Oi! Como foi seu dia?&#10;Crush: Foi bom, e o seu?&#10;Você: Também foi ótimo! Estava pensando em você..."
                    className="w-full h-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#9B4DFF] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-white/40">
                    {characterCount} / {isPremium ? '∞' : FREE_PLAN_LIMIT}
                  </div>
                </div>

                {isOverLimit && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-yellow-400 font-medium mb-1">
                        Limite de caracteres excedido
                      </p>
                      <p className="text-white/60 text-sm mb-3">
                        Você atingiu o limite de {FREE_PLAN_LIMIT} caracteres do plano gratuito.
                        Faça upgrade para Premium e analise conversas ilimitadas!
                      </p>
                      <Button
                        size="sm"
                        onClick={() => router.push('/premium')}
                        className="bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD]"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Fazer Upgrade
                      </Button>
                    </div>
                  </div>
                )}

                {error && !isOverLimit && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    fullWidth
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || isOverLimit || !conversationText.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analisar Conversa
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleImageUpload}
                    className="px-6"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Análise Completa</h3>
                    <p className="text-white/60 text-sm">
                      Descubra o nível de interesse, tom emocional e significados ocultos
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/20">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sugestões Inteligentes</h3>
                    <p className="text-white/60 text-sm">
                      Receba respostas prontas e dicas para manter a conversa fluindo
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Analysis Results */}
            <div className="space-y-6">
              {/* Interest Level */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h2 className="font-semibold text-lg">Nível de Interesse</h2>
                  </div>
                  <div className={`text-3xl font-bold ${getInterestColor(analysisResult.interestLevel.score)}`}>
                    {analysisResult.interestLevel.score}%
                  </div>
                </div>
                <p className="text-white/80 mb-4">{analysisResult.interestLevel.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/60">Indicadores:</p>
                  {analysisResult.interestLevel.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2" />
                      <p className="text-white/80 text-sm">{indicator}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Emotional Tone */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold text-lg">Tom Emocional</h2>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-white/60 mb-2">Tom Principal:</p>
                  <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <p className="text-purple-300 font-medium">{analysisResult.emotionalTone.primary}</p>
                  </div>
                </div>
                {analysisResult.emotionalTone.secondary.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-white/60 mb-2">Tons Secundários:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.emotionalTone.secondary.map((tone, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm"
                        >
                          {tone}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-white/80">{analysisResult.emotionalTone.description}</p>
              </Card>

              {/* Meaning */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold text-lg">O Que Ele/Ela Quis Dizer</h2>
                </div>
                <p className="text-white/80 mb-4">{analysisResult.meaning.summary}</p>
                {analysisResult.meaning.hiddenMessages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white/60">Mensagens Ocultas:</p>
                    {analysisResult.meaning.hiddenMessages.map((message, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-white/80 text-sm">{message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Ghosting Risk */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="font-semibold text-lg">Risco de Ghosting</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getRiskColor(analysisResult.ghostingRisk.level)}`}>
                      {analysisResult.ghostingRisk.percentage}%
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisResult.ghostingRisk.level === 'baixo'
                        ? 'bg-green-500/20 text-green-400'
                        : analysisResult.ghostingRisk.level === 'médio'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {analysisResult.ghostingRisk.level.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/60">Fatores de Risco:</p>
                  {analysisResult.ghostingRisk.reasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                      <p className="text-white/80 text-sm">{reason}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggested Response */}
              <Card className="bg-gradient-to-r from-[#9B4DFF]/10 to-[#6A0DAD]/10 border-[#9B4DFF]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold text-lg">Sugestão de Resposta</h2>
                </div>
                <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-white/90 italic">"{analysisResult.suggestedResponse.message}"</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-white/60 mb-2">Tom Recomendado:</p>
                  <span className="px-3 py-1 bg-[#9B4DFF]/20 border border-[#9B4DFF]/30 rounded-full text-sm text-[#9B4DFF]">
                    {analysisResult.suggestedResponse.tone}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/60">Dicas:</p>
                  {analysisResult.suggestedResponse.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => {
                    setAnalysisResult(null);
                    setConversationText('');
                  }}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Nova Análise
                </Button>
                <Button
                  fullWidth
                  onClick={() => router.push('/chat')}
                  className="bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD]"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Praticar no Chat
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
