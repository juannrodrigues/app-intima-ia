'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastNotification = ({ toast, onClose }: ToastNotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/50',
    warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50'
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`bg-gradient-to-r ${colors[toast.type]} border backdrop-blur-sm rounded-xl p-4 shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in-right`}
    >
      <Icon className={`w-5 h-5 ${iconColors[toast.type]} flex-shrink-0`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map(toast => (
        <ToastNotification key={toast.id} toast={toast} onClose={closeToast} />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    warning: (message: string) => showToast('warning', message),
    info: (message: string) => showToast('info', message)
  };
}
