import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface UserStats {
  user_id: string;
  level: number;
  xp: number;
  max_xp: number;
  streak: number;
  total_conversations: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  total: number;
  completed: boolean;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: 'chat' | 'message' | 'roleplay' | 'analysis';
  title: string;
  created_at: string;
}
