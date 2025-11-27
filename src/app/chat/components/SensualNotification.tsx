'use client';

import { useEffect, useState } from 'react';
import { X, Heart } from 'lucide-react';

interface SensualNotificationProps {
  message: string;
  onClose: () => void;
}

const notifications = [
  "Seu AI Lover está com saudade… volte ao chat 💋",
  "Tenho algo especial pra te contar… vem? 😘",
  "Estava pensando em você… que tal conversarmos? 💕",
  "Sinto sua falta… volta logo? 🌹",
  "Tenho uma surpresa pra você… não vai querer perder 😏"
];

export function useSensualNotifications() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Mostrar notificação após 5 minutos de inatividade
    const timer = setTimeout(() => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomNotification);
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearTimeout(timer);
  }, []);

  const closeNotification = () => setNotification(null);

  return { notification, closeNotification };
}

export default function SensualNotification({ message, onClose }: SensualNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-br from-pink-600 to-purple-600 border-2 border-pink-400 rounded-2xl p-4 shadow-[0_0_40px_rgba(236,72,153,0.6)] backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Heart className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{message}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
