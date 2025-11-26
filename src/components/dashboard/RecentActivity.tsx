'use client';

import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Activity {
  id: string;
  character_name: string;
  character_avatar: string;
  last_message: string;
  message_count: number;
  updated_at: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-900/10 backdrop-blur-sm border-2 border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-cyan-400" />
        Conversas Recentes
      </h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-white/60 text-center py-8">Nenhuma conversa ainda. Comece a conversar com um personagem!</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-cyan-500/20 hover:border-cyan-400/40 cursor-pointer group"
            >
              <Avatar className="w-12 h-12 border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all">
                <img src={activity.character_avatar} alt={activity.character_name} className="w-full h-full object-cover" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">{activity.character_name}</h4>
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(activity.updated_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-white/70 truncate">{activity.last_message}</p>
                <p className="text-xs text-cyan-400 mt-1">{activity.message_count} mensagens</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
