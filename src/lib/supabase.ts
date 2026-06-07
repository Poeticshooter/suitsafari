import { createClient } from '@supabase/supabase-js'

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()
