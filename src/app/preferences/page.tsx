'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/Button';
import { Card } from '@/components/custom/Card';
import {
  ChevronLeft,
  Heart,
  Flame,
  Crown,
  Moon,
  Globe,
  Zap,
  Shield,
  Bell,
  Eye,
  Save,
} from 'lucide-react';

interface UserPreferences {
  tone: 'romantic' | 'bold' | 'dominant' | 'shy';
  intensity: 'light' | 'moderate' | 'hot';
  language: 'pt-BR' | 'pt-PT' | 'es' | 'en';
  country: string;
  useSlang: boolean;
  notifications: boolean;
  privateMode: boolean;
}

export default function PreferencesPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences>({
    tone: 'romantic',
    intensity: 'moderate',
    language: 'pt-BR',
    country: 'Brasil',
    useSlang: true,
    notifications: true,
    privateMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Aqui você salvaria as preferências no backend/localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toneOptions = [
    {
      value: 'romantic',
      label: 'Romântico',
      icon: Heart,
      description: 'Carinhoso, apaixonado e emotivo',
    },
    {
      value: 'bold',
      label: 'Ousado',
      icon: Flame,
      description: 'Confiante, provocante e direto',
    },
    {
      value: 'dominant',
      label: 'Dominante',
      icon: Crown,
      description: 'Assertivo, sedutor e no controle',
    },
    {
      value: 'shy',
      label: 'Tímido',
      icon: Moon,
      description: 'Doce, reservado e delicado',
    },
  ];

  const intensityOptions = [
    {
      value: 'light',
      label: 'Leve',
      emoji: '🌙',
      description: 'Conversas suaves e sutis',
    },
    {
      value: 'moderate',
      label: 'Moderada',
      emoji: '🔥',
      description: 'Equilíbrio entre romance e sensualidade',
    },
    {
      value: 'hot',
      label: 'Quente',
      emoji: '💥',
      description: 'Conversas intensas e apaixonadas',
    },
  ];

  const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
    { value: 'pt-PT', label: 'Português (Portugal)', flag: '🇵🇹' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-20">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#0D0D0D]/95 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Preferências</h1>
              <p className="text-sm text-white/60">
                Personalize sua experiência
              </p>
            </div>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Save className="w-4 h-4" />
              Salvo!
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tom de Conversa */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#9B4DFF]" />
            Tom de Conversa
          </h2>
          <p className="text-white/60 text-sm mb-4">
            Escolha como a IA deve se comunicar com você
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {toneOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.tone === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      tone: option.value as any,
                    })
                  }
                  className={`p-4 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'border-[#9B4DFF] bg-[#9B4DFF]/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{option.label}</span>
                  </div>
                  <p className="text-xs text-white/60">{option.description}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Intensidade */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#9B4DFF]" />
            Intensidade
          </h2>
          <p className="text-white/60 text-sm mb-4">
            Defina o nível de sensualidade das conversas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {intensityOptions.map((option) => {
              const isSelected = preferences.intensity === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      intensity: option.value as any,
                    })
                  }
                  className={`p-4 rounded-xl border transition-all text-center ${
                    isSelected
                      ? 'border-[#9B4DFF] bg-[#9B4DFF]/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="font-semibold mb-1">{option.label}</div>
                  <p className="text-xs text-white/60">{option.description}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Idioma e Região */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#9B4DFF]" />
            Idioma e Região
          </h2>
          <p className="text-white/60 text-sm mb-4">
            A IA usará gírias e expressões do seu país
          </p>
          <div className="space-y-3">
            {languageOptions.map((option) => {
              const isSelected = preferences.language === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      language: option.value as any,
                    })
                  }
                  className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                    isSelected
                      ? 'border-[#9B4DFF] bg-[#9B4DFF]/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.flag}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#9B4DFF]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Usar Gírias */}
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium mb-1">Usar gírias regionais</div>
                <p className="text-xs text-white/60">
                  A IA usará expressões típicas do seu país
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.useSlang}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    useSlang: e.target.checked,
                  })
                }
                className="w-12 h-6 rounded-full appearance-none bg-white/20 checked:bg-gradient-to-r checked:from-[#9B4DFF] checked:to-[#6A0DAD] relative cursor-pointer transition-all before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-6"
              />
            </label>
          </div>
        </Card>

        {/* Privacidade */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#9B4DFF]" />
            Privacidade e Segurança
          </h2>

          <div className="space-y-4">
            {/* Notificações */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="font-medium mb-1">Notificações</div>
                    <p className="text-xs text-white/60">
                      Receber alertas de novas mensagens
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      notifications: e.target.checked,
                    })
                  }
                  className="w-12 h-6 rounded-full appearance-none bg-white/20 checked:bg-gradient-to-r checked:from-[#9B4DFF] checked:to-[#6A0DAD] relative cursor-pointer transition-all before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-6"
                />
              </label>
            </div>

            {/* Modo Privado */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="font-medium mb-1">Modo Privado</div>
                    <p className="text-xs text-white/60">
                      Ocultar conversas da tela inicial
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.privateMode}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      privateMode: e.target.checked,
                    })
                  }
                  className="w-12 h-6 rounded-full appearance-none bg-white/20 checked:bg-gradient-to-r checked:from-[#9B4DFF] checked:to-[#6A0DAD] relative cursor-pointer transition-all before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-6"
                />
              </label>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} fullWidth>
          <span className="flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Salvar Preferências
          </span>
        </Button>
      </main>
    </div>
  );
}
