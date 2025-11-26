export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: 'free' | 'premium';
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  character_name: string;
  character_avatar: string;
  last_message: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}

export interface UserStats {
  total_conversations: number;
  total_messages: number;
  active_days: number;
  favorite_character: string;
  weekly_activity: {
    day: string;
    messages: number;
  }[];
  monthly_progress: {
    month: string;
    conversations: number;
  }[];
}
