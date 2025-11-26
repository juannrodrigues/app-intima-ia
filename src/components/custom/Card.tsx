import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 ${
        hover ? 'transition-all duration-300 hover:bg-white/10 hover:border-[#9B4DFF]/50 hover:shadow-[0_0_30px_rgba(155,77,255,0.3)]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
