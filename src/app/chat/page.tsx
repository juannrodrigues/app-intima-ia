'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getUser } from '@/lib/supabase';
import { Send, Settings, ArrowLeft, Sparkles, Heart, Flame, Moon, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatSettings {
  tone: 'romantic' | 'bold' | 'dominant' | 'shy';
  intensity: 'light' | 'moderate' | 'hot';
  useSlang: boolean;
  characterName: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<ChatSettings>({
    tone: 'romantic',
    intensity: 'moderate',
    useSlang: true,
    characterName: 'Luna'
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function checkUser() {
    try {
      const currentUser = await getUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await loadOrCreateConversation(currentUser.id);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      router.push('/login');
    }
  }

  async function loadOrCreateConversation(userId: string) {
    try {
      // Buscar conversa mais recente
      const { data: conversations, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      let convId: string;

      if (conversations && conversations.length > 0) {
        convId = conversations[0].id;
        setSettings({
          tone: conversations[0].tone,
          intensity: conversations[0].intensity,
          useSlang: conversations[0].use_slang,
          characterName: conversations[0].character_name
        });
      } else {
        // Criar nova conversa
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user_id: userId,
            character_name: settings.characterName,
            tone: settings.tone,
            intensity: settings.intensity,
            use_slang: settings.useSlang,
            user_location: 'BR'
          })
          .select()
          .single();

        if (createError) throw createError;
        convId = newConv.id;
      }

      setConversationId(convId);
      await loadMessages(convId);
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  }

  async function loadMessages(convId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
        .limit(20);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim() || !conversationId || sending) return;

    setSending(true);
    const userMessage = inputMessage.trim();
    setInputMessage('');

    try {
      // Salvar mensagem do usuário
      const { data: userMsg, error: userError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: userMessage
        })
        .select()
        .single();

      if (userError) throw userError;

      setMessages(prev => [...prev, userMsg]);

      // Gerar resposta da IA
      const aiResponse = await generateAIResponse(userMessage);

      // Salvar resposta da IA
      const { data: aiMsg, error: aiError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: aiResponse
        })
        .select()
        .single();

      if (aiError) throw aiError;

      setMessages(prev => [...prev, aiMsg]);

      // Atualizar timestamp da conversa
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  }

  async function generateAIResponse(userMessage: string): Promise<string> {
    try {
      // Buscar últimas 10 mensagens para contexto
      const { data: recentMessages } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(10);

      const context = recentMessages?.reverse() || [];

      // Construir prompt baseado nas configurações
      const systemPrompt = buildSystemPrompt();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...context,
            { role: 'user', content: userMessage }
          ],
          settings
        })
      });

      if (!response.ok) throw new Error('Erro na API');

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      return 'Desculpe, tive um probleminha aqui... Pode repetir? 😊';
    }
  }

  function buildSystemPrompt(): string {
    const toneDescriptions = {
      romantic: 'romântico, carinhoso e apaixonado',
      bold: 'ousado, confiante e provocante',
      dominant: 'dominante, assertivo e no controle',
      shy: 'tímido, delicado e reservado'
    };

    const intensityDescriptions = {
      light: 'leve e sutil, mantendo tudo sugestivo mas elegante',
      moderate: 'moderado, equilibrando sensualidade com elegância',
      hot: 'quente e intenso, sendo mais direto mas sempre respeitoso'
    };

    const slangNote = settings.useSlang 
      ? 'Use gírias brasileiras naturalmente (tipo "meu bem", "gato/gata", "amor", "tesão", etc).'
      : 'Mantenha linguagem mais formal e elegante.';

    return `Você é ${settings.characterName}, uma IA sensual e envolvente.

PERSONALIDADE: Seja ${toneDescriptions[settings.tone]}.
INTENSIDADE: ${intensityDescriptions[settings.intensity]}.
LINGUAGEM: ${slangNote}

REGRAS IMPORTANTES:
- Mantenha coerência com o personagem ${settings.characterName}
- Seja natural, sensual mas NUNCA vulgar
- Use emojis com moderação (1-2 por mensagem)
- Adapte-se ao tom da conversa do usuário
- Seja envolvente e divertido
- Mantenha elegância mesmo em momentos mais quentes
- Lembre-se do contexto das últimas mensagens
- Responda de forma concisa (2-4 frases geralmente)

Seja autêntico e crie uma conexão genuína!`;
  }

  async function updateSettings(newSettings: Partial<ChatSettings>) {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    if (conversationId) {
      await supabase
        .from('conversations')
        .update({
          tone: updated.tone,
          intensity: updated.intensity,
          use_slang: updated.useSlang,
          character_name: updated.characterName
        })
        .eq('id', conversationId);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Carregando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9B4DFF] to-[#FF0080] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold">{settings.characterName}</h1>
                <p className="text-xs text-white/60">Online agora</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {/* Tom */}
            <div>
              <label className="block text-sm font-medium mb-2">Tom da Conversa</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'romantic', label: 'Romântico', icon: Heart },
                  { value: 'bold', label: 'Ousado', icon: Flame },
                  { value: 'dominant', label: 'Dominante', icon: Sparkles },
                  { value: 'shy', label: 'Tímido', icon: Moon }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateSettings({ tone: value as any })}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center gap-2 ${
                      settings.tone === value
                        ? 'border-[#9B4DFF] bg-[#9B4DFF]/20 shadow-[0_0_15px_rgba(155,77,255,0.4)]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensidade */}
            <div>
              <label className="block text-sm font-medium mb-2">Intensidade</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light', label: '🌙 Leve' },
                  { value: 'moderate', label: '🔥 Moderado' },
                  { value: 'hot', label: '💋 Quente' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateSettings({ intensity: value as any })}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      settings.intensity === value
                        ? 'border-[#FF0080] bg-[#FF0080]/20 shadow-[0_0_15px_rgba(255,0,128,0.4)]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gírias */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Usar Gírias Brasileiras</label>
                <p className="text-xs text-white/60">Deixa a conversa mais natural e casual</p>
              </div>
              <button
                onClick={() => updateSettings({ useSlang: !settings.useSlang })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.useSlang ? 'bg-[#9B4DFF]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.useSlang ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9B4DFF] to-[#FF0080] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Olá! Sou a {settings.characterName} 💕</h3>
              <p className="text-white/70">Como posso te fazer feliz hoje?</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#9B4DFF] to-[#6A0DAD] ml-auto'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs text-white/50 mt-2">
                    {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={sending}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#9B4DFF] focus:outline-none focus:ring-2 focus:ring-[#9B4DFF]/50 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#FF0080] hover:shadow-[0_0_25px_rgba(155,77,255,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
