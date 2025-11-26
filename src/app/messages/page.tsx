'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { Card } from '@/components/custom/Card';
import {
  ArrowLeft,
  MessageSquarePlus,
  Sparkles,
  Copy,
  Send,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();
  const [situation, setSituation] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!situation.trim()) return;

    setLoading(true);
    setMessages([]);
    setError(null);

    try {
      console.log('📤 Enviando requisição para gerar mensagens...');
      
      const response = await fetch('/api/generate-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation }),
      });

      console.log('📥 Resposta recebida:', response.status);

      const data = await response.json();
      console.log('📦 Dados recebidos:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erro ao gerar mensagens');
      }

      if (!data.messages || !Array.isArray(data.messages)) {
        throw new Error('Formato de resposta inválido');
      }

      setMessages(data.messages);
      console.log('✅ Mensagens geradas com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao gerar mensagens:', error);
      const errorMessage = error.message || 'Erro ao gerar mensagens. Tente novamente.';
      setError(errorMessage);
      
      // Exibe alerta apenas se for erro de configuração
      if (errorMessage.includes('API Key')) {
        alert('⚠️ Configure sua API Key da OpenAI para usar esta funcionalidade.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleSendToChat = (text: string) => {
    // Armazena a mensagem no localStorage para ser usada no chat
    localStorage.setItem('pendingMessage', text);
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Mensagens Prontas</h1>
              <p className="text-white/60 text-sm">Crie respostas personalizadas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Explicação */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Como funciona?</h2>
              <p className="text-white/80 leading-relaxed">
                Descreva qualquer situação e receba 3 opções de mensagens criativas e personalizadas.
                Seja para iniciar uma conversa, responder algo específico ou mandar aquela mensagem especial!
              </p>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                <p>💡 <strong>Exemplos:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>"Quero mandar algo quente pro crush"</li>
                  <li>"Preciso responder um elogio de forma fofa"</li>
                  <li>"Como iniciar conversa com alguém que conheci hoje"</li>
                  <li>"Mensagem romântica de boa noite"</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Input de Situação */}
        <Card className="mb-8">
          <label className="block mb-3 font-semibold text-lg">
            Descreva sua situação
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Ex: Quero mandar algo quente pro crush..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-none"
            disabled={loading}
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={!situation.trim() || loading}
              className="min-w-[160px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Gerar Mensagens
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Erro */}
        {error && (
          <Card className="mb-8 bg-red-500/10 border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-500 mb-1">Erro ao gerar mensagens</h3>
                <p className="text-white/80 text-sm">{error}</p>
                {error.includes('API Key') && (
                  <p className="text-white/60 text-sm mt-2">
                    💡 Configure sua chave da OpenAI nas variáveis de ambiente.
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Mensagens Geradas */}
        {messages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-purple-500" />
              Suas mensagens prontas
            </h3>
            {messages.map((message, index) => (
              <Card key={index} hover className="group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 leading-relaxed mb-4">{message}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(message, index)}
                        className="flex-1 sm:flex-none"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSendToChat(message)}
                        className="flex-1 sm:flex-none"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar para Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {!loading && messages.length === 0 && situation.trim() === '' && !error && (
          <Card className="text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-purple-500/10 mb-4">
              <MessageSquarePlus className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pronto para começar?</h3>
            <p className="text-white/60">
              Descreva sua situação acima e receba mensagens personalizadas!
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
