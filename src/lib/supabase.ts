import { createBrowserClient } from '@supabase/ssr'

// Cliente para uso no browser (componentes client-side)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Instância padrão para uso direto
export const supabase = createClient()

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key'
  );
}

export async function getUser() {
  const client = createClient()
  const { data: { user }, error } = await client.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

export async function signOut() {
  const client = createClient()
  const { error } = await client.auth.signOut()
  if (error) throw error
}
