'use client';

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'pink' | 'purple' | 'cyan' | 'yellow' | 'green';
}

const colorClasses = {
  pink: {
    border: 'border-pink-500/50 hover:border-pink-400',
    shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]',
    icon: 'text-pink-400',
    gradient: 'from-pink-500/20 to-pink-900/20',
  },
  purple: {
    border: 'border-purple-500/50 hover:border-purple-400',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    icon: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-900/20',
  },
  cyan: {
    border: 'border-cyan-500/50 hover:border-cyan-400',
    shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]',
    icon: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-cyan-900/20',
  },
  yellow: {
    border: 'border-yellow-500/50 hover:border-yellow-400',
    shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]',
    icon: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-900/20',
  },
  green: {
    border: 'border-green-500/50 hover:border-green-400',
    shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]',
    icon: 'text-green-400',
    gradient: 'from-green-500/20 to-green-900/20',
  },
};

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <Card className={`bg-gradient-to-br ${colors.gradient} backdrop-blur-sm border-2 ${colors.border} ${colors.shadow} transition-all duration-300 p-6 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs. semana passada
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white/10 ${colors.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
