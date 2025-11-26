import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#9B4DFF] to-[#6A0DAD] text-white hover:shadow-[0_0_20px_rgba(155,77,255,0.5)]',
    secondary: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm',
    outline: 'border-2 border-[#9B4DFF] text-[#9B4DFF] hover:bg-[#9B4DFF]/10',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
