'use client';

import { useState, useEffect } from 'react';
import { Clock, Trash2, MessageCircle, X } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  created_at: string;
  last_message: string;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (session: ChatSession) => void;
  currentMessages: any[];
}

export default function ChatHistory({ isOpen, onClose, onLoadSession, currentMessages }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, [isOpen]);

  const loadSessions = () => {
    const saved = localStorage.getItem('chatSessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  };

  const saveCurrentSession = () => {
    if (currentMessages.length === 0) return;

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Conversa ${new Date().toLocaleDateString('pt-BR')}`,
      messages: currentMessages,
      created_at: new Date().toISOString(),
      last_message: currentMessages[currentMessages.length - 1]?.content.substring(0, 50) + '...'
    };

    const updated = [newSession, ...sessions].slice(0, 20); // Máximo 20 sessões
    setSessions(updated);
    localStorage.setItem('chatSessions', JSON.stringify(updated));
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('chatSessions', JSON.stringify(updated));
  };

  const clearAllSessions = () => {
    if (confirm('Deseja realmente apagar todo o histórico?')) {
      setSessions([]);
      localStorage.removeItem('chatSessions');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold">Histórico de Conversas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {/* Botão Salvar Conversa Atual */}
          {currentMessages.length > 0 && (
            <button
              onClick={saveCurrentSession}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <div className="text-left flex-1">
                <p className="font-semibold">Salvar conversa atual</p>
                <p className="text-xs text-white/60">{currentMessages.length} mensagens</p>
              </div>
            </button>
          )}

          {/* Lista de Sessões */}
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma conversa salva ainda</p>
              <p className="text-sm mt-2">Suas conversas aparecerão aqui</p>
            </div>
          ) : (
            <>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => {
                        onLoadSession(session);
                        onClose();
                      }}
                      className="flex-1 text-left"
                    >
                      <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                        {session.title}
                      </h3>
                      <p className="text-sm text-white/60 mb-2 line-clamp-2">
                        {session.last_message}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{new Date(session.created_at).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span>{session.messages.length} mensagens</span>
                      </div>
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Botão Limpar Tudo */}
              <button
                onClick={clearAllSessions}
                className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all duration-300 text-red-400 text-sm font-semibold"
              >
                Limpar todo histórico
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
