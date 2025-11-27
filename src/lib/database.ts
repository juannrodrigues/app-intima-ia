import { createClient } from './supabase';

export interface UserStats {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  max_xp: number;
  streak: number;
  last_activity_date: string;
  total_conversations: number;
  total_messages: number;
  total_roleplays: number;
  total_analyses: number;
  created_at: string;
  updated_at: string;
}

export interface DailyMission {
  id: string;
  user_id: string;
  mission_type: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  xp: number;
  completed: boolean;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'chat' | 'message' | 'roleplay' | 'analysis';
  title: string;
  description?: string;
  metadata?: any;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  character_name: string;
  character_avatar?: string;
  last_message?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

// ============= USER STATS =============

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
  
  return data;
}

export async function createUserStats(userId: string): Promise<UserStats | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_stats')
    .insert({
      user_id: userId,
      level: 1,
      xp: 0,
      max_xp: 1000,
      streak: 1,
      last_activity_date: new Date().toISOString().split('T')[0],
      total_conversations: 0,
      total_messages: 0,
      total_roleplays: 0,
      total_analyses: 0,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user stats:', error);
    return null;
  }
  
  return data;
}

export async function updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_stats')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user stats:', error);
    return null;
  }
  
  return data;
}

export async function addXP(userId: string, xpAmount: number): Promise<UserStats | null> {
  const stats = await getUserStats(userId);
  if (!stats) return null;
  
  let newXP = stats.xp + xpAmount;
  let newLevel = stats.level;
  let newMaxXP = stats.max_xp;
  
  // Level up logic
  while (newXP >= newMaxXP) {
    newXP -= newMaxXP;
    newLevel += 1;
    newMaxXP = Math.floor(newMaxXP * 1.5); // Aumenta 50% a cada nível
  }
  
  return await updateUserStats(userId, {
    xp: newXP,
    level: newLevel,
    max_xp: newMaxXP,
  });
}

export async function updateStreak(userId: string): Promise<UserStats | null> {
  const stats = await getUserStats(userId);
  if (!stats) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = stats.last_activity_date;
  
  // Calcula diferença de dias
  const lastDate = new Date(lastActivity);
  const todayDate = new Date(today);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let newStreak = stats.streak;
  
  if (diffDays === 0) {
    // Mesmo dia, não faz nada
    return stats;
  } else if (diffDays === 1) {
    // Dia consecutivo, aumenta streak
    newStreak += 1;
  } else {
    // Quebrou a sequência
    newStreak = 1;
  }
  
  return await updateUserStats(userId, {
    streak: newStreak,
    last_activity_date: today,
  });
}

// ============= DAILY MISSIONS =============

export async function getDailyMissions(userId: string): Promise<DailyMission[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching daily missions:', error);
    return [];
  }
  
  return data || [];
}

export async function createDailyMissions(userId: string): Promise<DailyMission[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const missions = [
    {
      user_id: userId,
      mission_type: 'chat',
      title: 'Primeira Conversa do Dia',
      description: 'Inicie uma conversa com a IA',
      progress: 0,
      total: 1,
      xp: 50,
      completed: false,
      date: today,
    },
    {
      user_id: userId,
      mission_type: 'generator',
      title: 'Gerador de Mensagens',
      description: 'Use o gerador 3 vezes',
      progress: 0,
      total: 3,
      xp: 100,
      completed: false,
      date: today,
    },
    {
      user_id: userId,
      mission_type: 'roleplay',
      title: 'Modo Fantasia',
      description: 'Complete um roleplay',
      progress: 0,
      total: 1,
      xp: 150,
      completed: false,
      date: today,
    },
    {
      user_id: userId,
      mission_type: 'analysis',
      title: 'Análise Profunda',
      description: 'Analise 2 conversas',
      progress: 0,
      total: 2,
      xp: 120,
      completed: false,
      date: today,
    },
  ];
  
  const { data, error } = await supabase
    .from('daily_missions')
    .insert(missions)
    .select();
  
  if (error) {
    console.error('Error creating daily missions:', error);
    return [];
  }
  
  return data || [];
}

export async function updateMissionProgress(
  missionId: string,
  progress: number,
  userId: string
): Promise<DailyMission | null> {
  const supabase = createClient();
  
  // Busca a missão atual
  const { data: mission } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('id', missionId)
    .single();
  
  if (!mission) return null;
  
  const completed = progress >= mission.total;
  
  // Atualiza a missão
  const { data, error } = await supabase
    .from('daily_missions')
    .update({
      progress,
      completed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', missionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating mission progress:', error);
    return null;
  }
  
  // Se completou a missão, adiciona XP
  if (completed && !mission.completed) {
    await addXP(userId, mission.xp);
  }
  
  return data;
}

// ============= USER ACTIVITIES =============

export async function getUserActivities(userId: string, limit: number = 10): Promise<UserActivity[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
  
  return data || [];
}

export async function createActivity(
  userId: string,
  activityType: 'chat' | 'message' | 'roleplay' | 'analysis',
  title: string,
  description?: string,
  metadata?: any
): Promise<UserActivity | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_activities')
    .insert({
      user_id: userId,
      activity_type: activityType,
      title,
      description,
      metadata,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating activity:', error);
    return null;
  }
  
  return data;
}

// ============= CONVERSATIONS =============

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  
  return data || [];
}

export async function createConversation(
  userId: string,
  characterName: string,
  characterAvatar?: string
): Promise<Conversation | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      character_name: characterName,
      character_avatar: characterAvatar,
      message_count: 0,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
  
  return data;
}

// ============= HELPER FUNCTIONS =============

export async function initializeUserData(userId: string): Promise<void> {
  // Verifica se já tem stats
  let stats = await getUserStats(userId);
  if (!stats) {
    stats = await createUserStats(userId);
  }
  
  // Verifica se já tem missões do dia
  const missions = await getDailyMissions(userId);
  if (missions.length === 0) {
    await createDailyMissions(userId);
  }
}

export async function incrementMissionProgress(
  userId: string,
  missionType: string
): Promise<void> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  // Busca a missão do tipo específico
  const { data: mission } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_type', missionType)
    .eq('date', today)
    .single();
  
  if (mission && !mission.completed) {
    await updateMissionProgress(mission.id, mission.progress + 1, userId);
  }
}
