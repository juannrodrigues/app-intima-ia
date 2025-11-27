'use client';

import { useState, useEffect } from 'react';
import { User, Camera, Save, X } from 'lucide-react';

interface UserProfileData {
  name: string;
  avatar: string;
  bio: string;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfileData) => void;
}

const AVATAR_OPTIONS = [
  '😊', '😎', '🥰', '😘', '🤗', '😏', '🔥', '💋',
  '👨', '👩', '🧔', '👱', '🦸', '🧑‍🎤', '👸', '🤴'
];

export default function UserProfile({ isOpen, onClose, onSave }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    avatar: '😊',
    bio: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold">Meu Perfil</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Escolha seu Avatar</label>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setProfile({ ...profile, avatar: emoji })}
                  className={`text-3xl p-2 rounded-lg transition-all duration-300 ${
                    profile.avatar === emoji
                      ? 'bg-purple-500/30 border-2 border-purple-500 scale-110'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Seu Nome</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Como gostaria de ser chamado(a)?"
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Sobre Você</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Conte um pouco sobre você... (opcional)"
              maxLength={150}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
            />
            <p className="text-xs text-white/40 mt-1">{profile.bio.length}/150</p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!profile.name.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-[0_0_25px_rgba(155,77,255,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            <Save className="w-5 h-5" />
            Salvar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
