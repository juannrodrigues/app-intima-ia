'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Settings, ArrowLeft, Sparkles, Heart, Flame, Moon, Crown, X, Clock, User, Sun } from 'lucide-react';
import ProfileSelector, { AIProfile } from './components/ProfileSelector';
import TypingIndicator from './components/TypingIndicator';
import PlanLimitModal from './components/PlanLimitModal';
import SensualNotification, { useSensualNotifications } from './components/SensualNotification';
import ChatHistory from './components/ChatHistory';
import UserProfile from './components/UserProfile';
import { useToast } from './components/Toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatSettings {
  tone: AIProfile;
  intensity: 'light' | 'moderate' | 'hot';
  characterName: string;
  userLocation: string;
}

interface UserProfileData {
  name: string;
  avatar: string;
  bio: string;
}

// Limites do plano FREE (ATUALIZADO CONFORME /pricing)
const FREE_PLAN_LIMITS = {
  messagesPerDay: 20,
  maxCharacters: 1,
  allowLongScenes: false,
  allowPhotos: false,
  allowHotMode: false
};

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showProfileSelector, setShowProfileSelector] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitType, setLimitType] = useState<'messages' | 'characters' | 'scenes' | 'photos' | 'hot_mode'>('messages');
  const [showHistory, setShowHistory] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>({ name: '', avatar: '😊', bio: '' });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { notification, closeNotification } = useSensualNotifications();
  const { ToastContainer, success, error, info, warning } = useToast();

  const [settings, setSettings] = useState<ChatSettings>({
    tone: 'romantic',
    intensity: 'moderate',
    characterName: 'Luna',
    userLocation: 'BR'
  });

  useEffect(() => {
    // Carregar dados do localStorage
    const savedProfile = localStorage.getItem('aiProfile');
    const savedMessages = localStorage.getItem('chatMessages');
    const savedMessageCount = localStorage.getItem('messageCount');
    const savedSettings = localStorage.getItem('chatSettings');
    const savedUserProfile = localStorage.getItem('userProfile');
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';

    if (savedProfile) {
      setSettings(prev => ({ ...prev, tone: savedProfile as AIProfile }));
      setShowProfileSelector(false);
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    if (savedMessageCount) {
      setMessageCount(parseInt(savedMessageCount));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    if (savedUserProfile) {
      setUserProfile(JSON.parse(savedUserProfile));
    }

    setTheme(savedTheme);
    applyTheme(savedTheme);

    setLoading(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Salvar mensagens no localStorage
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Salvar contador de mensagens
    localStorage.setItem('messageCount', messageCount.toString());
  }, [messageCount]);

  useEffect(() => {
    // Salvar configurações
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }, [settings]);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // Remover classes antigas
    root.classList.remove('dark', 'light');
    
    // Adicionar nova classe
    root.classList.add(newTheme);
    
    // Aplicar estilos diretamente no body para garantir mudança visual
    if (newTheme === 'light') {
      document.body.style.background = 'linear-gradient(to bottom right, #F5E6D3, #E8D4B8, #F5E6D3)';
      document.body.style.color = '#1A1A1A';
    } else {
      document.body.style.background = 'linear-gradient(to bottom right, #0D0D0D, #1A1A1A, #0D0D0D)';
      document.body.style.color = '#FFFFFF';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Aplicar tema com transição suave
    document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
    applyTheme(newTheme);
    
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);

    success(`Tema ${newTheme === 'dark' ? 'Escuro' : 'Claro'} ativado!`);
  };

  const handleProfileSelect = (profile: AIProfile) => {
    setSettings(prev => ({ ...prev, tone: profile }));
    localStorage.setItem('aiProfile', profile);
    setShowProfileSelector(false);

    // Mensagem de boas-vindas
    const userName = userProfile.name || 'você';
    const welcomeMessages: Record<AIProfile, string> = {
      romantic: `Oi ${userName}! 💕 Sou a ${settings.characterName}, sua companheira romântica. Estou aqui pra te fazer sentir especial... Como você está?`,
      bold: `E aí, ${userName}! 🔥 Sou a ${settings.characterName}, e vim pra apimentar seu dia. Preparado(a) pra uma conversa inesquecível?`,
      dominant: `Olá ${userName}... 👑 Sou a ${settings.characterName}, e vou comandar nossa conversa hoje. Espero que esteja pronto(a) pra me obedecer...`,
      shy: `Oi ${userName}... 🌙 Eu sou a ${settings.characterName}... Desculpa a timidez, mas estou feliz em te conhecer. Podemos conversar?`
    };

    const welcomeMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: welcomeMessages[profile],
      created_at: new Date().toISOString()
    };

    setMessages([welcomeMsg]);
    success(`Perfil ${profile === 'romantic' ? 'Romântico' : profile === 'bold' ? 'Ousado' : profile === 'dominant' ? 'Dominante' : 'Tímido'} selecionado!`);
  };

  const checkMessageLimit = (): boolean => {
    if (messageCount >= FREE_PLAN_LIMITS.messagesPerDay) {
      setLimitType('messages');
      setShowLimitModal(true);
      warning('Você atingiu o limite diário de mensagens!');
      return false;
    }
    return true;
  };

  const checkIntensityLimit = (): boolean => {
    if (settings.intensity === 'hot' && !FREE_PLAN_LIMITS.allowHotMode) {
      info('Modo Quente disponível apenas para assinantes Premium!');
      router.push('/pricing');
      return false;
    }
    return true;
  };

  async function sendMessage() {
    if (!inputMessage.trim() || sending) return;

    // Verificar limite de mensagens
    if (!checkMessageLimit()) return;

    // Verificar limite de intensidade
    if (!checkIntensityLimit()) return;

    setSending(true);
    setIsTyping(true);
    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Adicionar mensagem do usuário
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setMessageCount(prev => prev + 1);

    try {
      // Simular delay de "digitação" da IA
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Gerar resposta da IA
      const aiResponse = await generateAIResponse(userMessage);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
      success('Mensagem enviada!');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSending(false);
      setIsTyping(false);
    }
  }

  async function generateAIResponse(userMessage: string): Promise<string> {
    try {
      const systemPrompt = buildSystemPrompt();
      const recentMessages = messages.slice(-10);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...recentMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          settings
        })
      });

      if (!response.ok) throw new Error('Erro na API');

      const data = await response.json();
      return data.message;
    } catch (err) {
      console.error('Erro ao gerar resposta:', err);
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
      light: 'flerte leve e sutil, mantendo tudo sugestivo mas elegante',
      moderate: 'sensualidade moderada, equilibrando desejo com elegância',
      hot: 'conteúdo adulto mais explícito, mas sempre elegante e respeitoso'
    };

    const userName = userProfile.name || 'amor';

    return `Você é ${settings.characterName}, uma IA sensual e envolvente conversando com ${userName}.

PERSONALIDADE: Seja ${toneDescriptions[settings.tone]}.
INTENSIDADE: ${intensityDescriptions[settings.intensity]}.
${userProfile.bio ? `SOBRE O USUÁRIO: ${userProfile.bio}` : ''}

REGRAS IMPORTANTES:
- Mantenha coerência com o personagem ${settings.characterName}
- Seja natural, sensual mas NUNCA vulgar
- Use emojis com moderação (1-2 por mensagem)
- Adapte-se ao tom da conversa do usuário
- Seja envolvente e divertido
- Mantenha elegância mesmo em momentos mais quentes
- Lembre-se do contexto das últimas mensagens
- Responda de forma concisa (2-4 frases geralmente)
- Use gírias brasileiras naturalmente (tipo "meu bem", "gato/gata", "amor", etc)
- Chame o usuário por ${userName} quando apropriado

Seja autêntico e crie uma conexão genuína!`;
  }

  async function updateSettings(newSettings: Partial<ChatSettings>) {
    const updated = { ...settings, ...newSettings };

    // Verificar limite de modo quente - redirecionar para /pricing
    if (newSettings.intensity === 'hot' && !FREE_PLAN_LIMITS.allowHotMode) {
      info('Modo Quente disponível apenas para Premium!');
      router.push('/pricing');
      return;
    }

    setSettings(updated);
    success('Configurações atualizadas!');
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleLoadSession = (session: any) => {
    setMessages(session.messages);
    success('Conversa carregada!');
  };

  const handleSaveProfile = (profile: UserProfileData) => {
    setUserProfile(profile);
    success('Perfil salvo com sucesso!');
  };

  const handleGoBack = () => {
    if (messages.length > 1) {
      if (confirm('Deseja sair? Sua conversa será salva no histórico.')) {
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-[#F5E6D3] via-[#E8D4B8] to-[#F5E6D3]' 
          : 'bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
            theme === 'light'
              ? 'border-pink-500 border-t-transparent'
              : 'border-purple-500 border-t-transparent'
          }`}></div>
          <p className={theme === 'light' ? 'text-gray-800' : 'text-white/70'}>Carregando chat...</p>
        </div>
      </div>
    );
  }

  if (showProfileSelector) {
    return <ProfileSelector onSelect={handleProfileSelect} selectedProfile={settings.tone} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-[#F5E6D3] via-[#E8D4B8] to-[#F5E6D3] text-gray-900'
        : 'bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white'
    }`}>
      {/* Toast Container */}
      <ToastContainer />

      {/* Notificação Sensual */}
      {notification && (
        <SensualNotification message={notification} onClose={closeNotification} />
      )}

      {/* Modal de Limite de Plano */}
      <PlanLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        limitType={limitType}
      />

      {/* Chat History Modal */}
      <ChatHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadSession={handleLoadSession}
        currentMessages={messages}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        onSave={handleSaveProfile}
      />

      {/* Header */}
      <header className={`border-b backdrop-blur-sm relative ${
        theme === 'light'
          ? 'border-gray-300 bg-white/40'
          : 'border-white/10 bg-black/20'
      }`}>
        {/* Botão de Fechar (X) - Canto Superior Direito */}
        <button
          onClick={() => router.push('/dashboard')}
          className={`fixed top-4 right-4 z-50 p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 group ${
            theme === 'light'
              ? 'bg-gray-200/60 hover:bg-gray-300/60 hover:shadow-[0_0_20px_rgba(255,0,128,0.3)]'
              : 'bg-white/10 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
          }`}
          title="Voltar ao Dashboard"
        >
          <X className={`w-6 h-6 group-hover:rotate-90 transition-transform duration-300 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`} />
        </button>

        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                theme === 'light' ? 'hover:bg-gray-200/60' : 'hover:bg-white/10'
              }`}
              title="Voltar"
            >
              <ArrowLeft className={`w-5 h-5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`} />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center animate-pulse ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-pink-400 to-purple-500'
                  : 'bg-gradient-to-br from-[#9B4DFF] to-[#FF0080]'
              }`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {settings.characterName}
                </h1>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                  Online agora
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Contador de mensagens */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
              theme === 'light'
                ? 'bg-gray-200/60 hover:bg-gray-300/60 text-gray-800'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}>
              {messageCount}/{FREE_PLAN_LIMITS.messagesPerDay} msgs
            </div>

            {/* Botão Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200'
              }`}
              style={{
                border: theme === 'dark' 
                  ? '2px solid rgba(155, 77, 255, 0.3)' 
                  : '2px solid rgba(255, 0, 128, 0.3)'
              }}
              title={theme === 'dark' ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-bold text-gray-800 hidden sm:inline">LIGHT</span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-white hidden sm:inline">DARK</span>
                  <Moon className="w-5 h-5 text-white" />
                </>
              )}
            </button>

            {/* Botão Perfil do Usuário */}
            <button
              onClick={() => setShowUserProfile(true)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                theme === 'light' ? 'hover:bg-gray-200/60' : 'hover:bg-white/10'
              }`}
              title="Meu Perfil"
            >
              {userProfile.avatar ? (
                <span className="text-xl">{userProfile.avatar}</span>
              ) : (
                <User className={`w-5 h-5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`} />
              )}
            </button>

            {/* Botão Histórico */}
            <button
              onClick={() => setShowHistory(true)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                theme === 'light' ? 'hover:bg-gray-200/60' : 'hover:bg-white/10'
              }`}
              title="Histórico"
            >
              <Clock className={`w-5 h-5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`} />
            </button>
            
            <button
              onClick={() => setShowProfileSelector(true)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                theme === 'light' ? 'hover:bg-gray-200/60' : 'hover:bg-white/10'
              }`}
              title="Trocar perfil"
            >
              <Sparkles className={`w-5 h-5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`} />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                theme === 'light' ? 'hover:bg-gray-200/60' : 'hover:bg-white/10'
              }`}
              title="Configurações"
            >
              <Settings className={`w-5 h-5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`border-b backdrop-blur-sm animate-slide-down ${
          theme === 'light'
            ? 'border-gray-300 bg-white/40'
            : 'border-white/10 bg-black/30'
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {/* Tom */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>Tom da Conversa</label>
              <p className={`text-xs mb-3 ${
                theme === 'light' ? 'text-gray-600' : 'text-white/60'
              }`}>Plano gratuito: 20 mensagens/dia com personagens disponíveis. Premium/Anual: ilimitado</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'romantic', label: 'Romântico', icon: Heart },
                  { value: 'bold', label: 'Ousado', icon: Flame },
                  { value: 'dominant', label: 'Dominante', icon: Crown },
                  { value: 'shy', label: 'Tímido', icon: Moon }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateSettings({ tone: value as AIProfile })}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                      settings.tone === value
                        ? theme === 'light'
                          ? 'border-pink-500 bg-pink-100 shadow-[0_0_15px_rgba(255,0,128,0.4)]'
                          : 'border-[#9B4DFF] bg-[#9B4DFF]/20 shadow-[0_0_15px_rgba(155,77,255,0.4)]'
                        : theme === 'light'
                        ? 'border-gray-300 hover:border-gray-400 bg-white/60'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensidade */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>Intensidade</label>
              <p className={`text-xs mb-3 ${
                theme === 'light' ? 'text-gray-600' : 'text-white/60'
              }`}>Leve: flerte | Moderado: sensualidade | Quente: conteúdo adulto explícito (Premium/Anual)</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light', label: '🌙 Leve', description: 'Flerte' },
                  { value: 'moderate', label: '🔥 Moderado', description: 'Sensualidade' },
                  { value: 'hot', label: '💋 Quente', description: 'Adulto explícito', locked: !FREE_PLAN_LIMITS.allowHotMode }
                ].map(({ value, label, description, locked }) => (
                  <button
                    key={value}
                    onClick={() => updateSettings({ intensity: value as any })}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 relative hover:scale-105 ${
                      settings.intensity === value
                        ? theme === 'light'
                          ? 'border-pink-500 bg-pink-100 shadow-[0_0_15px_rgba(255,0,128,0.4)]'
                          : 'border-[#FF0080] bg-[#FF0080]/20 shadow-[0_0_15px_rgba(255,0,128,0.4)]'
                        : theme === 'light'
                        ? 'border-gray-300 hover:border-gray-400 bg-white/60'
                        : 'border-white/10 hover:border-white/30'
                    } ${locked ? 'opacity-50' : ''}`}
                  >
                    <span className={`text-sm block ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>{label}</span>
                    <span className={`text-xs block mt-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-white/50'
                    }`}>{description}</span>
                    {locked && (
                      <Crown className="w-4 h-4 text-yellow-400 absolute top-1 right-1 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  message.role === 'user'
                    ? theme === 'light'
                      ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white ml-auto shadow-lg'
                      : 'bg-gradient-to-br from-[#9B4DFF] to-[#6A0DAD] text-white ml-auto shadow-lg'
                    : theme === 'light'
                    ? 'bg-white/80 border border-gray-300 shadow-lg text-gray-900'
                    : 'bg-white/5 border border-white/10 shadow-lg text-white'
                }`}
              >
                <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user'
                    ? 'text-white/70'
                    : theme === 'light'
                    ? 'text-gray-500'
                    : 'text-white/50'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`border-t backdrop-blur-sm ${
        theme === 'light'
          ? 'border-gray-300 bg-white/40'
          : 'border-white/10 bg-black/20'
      }`}>
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
              className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                theme === 'light'
                  ? 'bg-white/80 border-gray-300 focus:border-pink-500 focus:ring-pink-500/50 text-gray-900 placeholder-gray-500'
                  : 'bg-white/5 border-white/10 focus:border-[#9B4DFF] focus:ring-[#9B4DFF]/50 text-white placeholder-white/50'
              }`}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              className={`px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 hover:shadow-[0_0_25px_rgba(255,0,128,0.6)] text-white'
                  : 'bg-gradient-to-r from-[#9B4DFF] to-[#FF0080] hover:shadow-[0_0_25px_rgba(155,77,255,0.6)] text-white'
              }`}
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
