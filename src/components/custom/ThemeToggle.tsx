'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.classList.toggle('light', savedTheme === 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Atualizar classes do HTML com animação suave
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    
    // Adicionar classe de transição temporária
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in">
      {/* Toggle Switch Container */}
      <button
        onClick={toggleTheme}
        className={`relative flex items-center gap-3 px-2 py-2 rounded-full transition-all duration-500 shadow-lg hover:shadow-2xl ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
            : 'bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200'
        }`}
        style={{
          width: '180px',
          border: theme === 'dark' 
            ? '2px solid rgba(155, 77, 255, 0.3)' 
            : '2px solid rgba(255, 0, 128, 0.3)'
        }}
        title={theme === 'dark' ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
      >
        {/* Light Mode Side */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 ${
            theme === 'light'
              ? 'bg-white shadow-[0_0_20px_rgba(255,0,128,0.6)] scale-105'
              : 'opacity-50'
          }`}
        >
          <Sun 
            className={`w-5 h-5 transition-all duration-500 ${
              theme === 'light' 
                ? 'text-orange-500 rotate-0' 
                : 'text-gray-400 rotate-180'
            }`} 
          />
          {theme === 'light' && (
            <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
              LIGHT
            </span>
          )}
        </div>

        {/* Dark Mode Side */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(155,77,255,0.6)] scale-105'
              : 'opacity-50'
          }`}
        >
          {theme === 'dark' && (
            <span className="text-xs font-bold text-white whitespace-nowrap">
              DARK
            </span>
          )}
          <Moon 
            className={`w-5 h-5 transition-all duration-500 ${
              theme === 'dark' 
                ? 'text-white rotate-0' 
                : 'text-gray-400 -rotate-90'
            }`} 
          />
        </div>

        {/* Sliding Background Indicator */}
        <div
          className={`absolute top-1 bottom-1 rounded-full transition-all duration-500 pointer-events-none ${
            theme === 'dark'
              ? 'right-1 left-[calc(50%+4px)] bg-gradient-to-br from-purple-500/20 to-pink-500/20'
              : 'left-1 right-[calc(50%+4px)] bg-gradient-to-br from-orange-400/20 to-yellow-400/20'
          }`}
          style={{
            boxShadow: theme === 'dark'
              ? '0 0 15px rgba(155, 77, 255, 0.4)'
              : '0 0 15px rgba(255, 0, 128, 0.4)'
          }}
        />
      </button>

      {/* Tooltip */}
      <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
          theme === 'dark'
            ? 'bg-gray-800 text-white border border-purple-500/30'
            : 'bg-white text-gray-800 border border-pink-500/30'
        }`}>
          {theme === 'dark' ? 'Clique para modo claro' : 'Clique para modo escuro'}
        </div>
      </div>
    </div>
  );
}
