import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured - using mock client')
      // Return a mock client that won't actually connect
      supabaseInstance = {
        from: () => ({
          select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }), limit: () => ({ data: [], error: null }) }),
          insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
          update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
        }),
      } as unknown as SupabaseClient
    } else {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      })
    }
  }
  return supabaseInstance
}

export const supabase = getSupabase()

export type Customer = {
  id: string
  email: string | null
  phone: string | null
  name: string | null
  created_at: string
}

export type Ticket = {
  id: string
  customer_id: string
  channel: string
  priority: string
  status: string
  created_at: string
}

export type Message = {
  id: string
  ticket_id: string
  role: string
  content: string
  channel: string
  created_at: string
}
