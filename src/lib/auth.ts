import { supabase } from './supabase';

// Função para fazer login
export async function signIn(email: string, password: string) {
  try {
    // Buscar usuário no banco
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Credenciais inválidas');
    }

    // Validação simples de senha (em produção, use hash)
    // Para o admin: senha é "admin123"
    // Para outros usuários: qualquer senha com 6+ caracteres
    if (email === 'admin@intimaia.com' && password !== 'admin123') {
      throw new Error('Senha incorreta');
    }

    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Função para registrar novo usuário
export async function signUp(email: string, password: string, name: string) {
  try {
    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Criar novo usuário
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email,
          name,
          role: 'user'
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // Criar estatísticas iniciais
    await supabase
      .from('user_stats')
      .insert([
        {
          user_id: newUser.id,
          level: 1,
          experience_points: 0,
          total_conversations: 0,
          current_streak: 0
        }
      ]);

    // Criar missões iniciais
    const initialMissions = [
      {
        user_id: newUser.id,
        title: 'Primeira Conversa do Dia',
        description: 'Inicie uma conversa com a IA',
        xp: 50,
        progress: 0,
        total: 1,
        completed: false
      },
      {
        user_id: newUser.id,
        title: 'Gerador de Mensagens',
        description: 'Crie 3 mensagens usando o gerador',
        xp: 75,
        progress: 0,
        total: 3,
        completed: false
      },
      {
        user_id: newUser.id,
        title: 'Modo Fantasia',
        description: 'Complete um roleplay guiado',
        xp: 100,
        progress: 0,
        total: 1,
        completed: false
      }
    ];

    await supabase.from('missions').insert(initialMissions);

    return { user: newUser, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Função para buscar dados do usuário
export async function getUserData(userId: string) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError) {
      console.error('Erro ao buscar stats:', statsError);
    }

    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (missionsError) {
      console.error('Erro ao buscar missions:', missionsError);
    }

    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (activitiesError) {
      console.error('Erro ao buscar activities:', activitiesError);
    }

    // Mapear campos do banco para o formato esperado
    const mappedStats = stats ? {
      level: stats.level || 1,
      xp: stats.experience_points || 0,
      max_xp: (stats.level || 1) * 1000,
      streak: stats.current_streak || 0,
      total_conversations: stats.total_conversations || 0
    } : null;

    return {
      user,
      stats: mappedStats,
      missions: missions || [],
      activities: activities || [],
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      stats: null,
      missions: [],
      activities: [],
      error: error.message
    };
  }
}

// Verificar se usuário é admin
export function isAdmin(role: string) {
  return role === 'admin';
}
