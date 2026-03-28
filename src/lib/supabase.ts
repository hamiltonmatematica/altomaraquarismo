import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente público para o frontend
export const supabase = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Cliente administrativo para o backend (Admin)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-project')
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null;

export const isSupabaseConfigured = !!supabase;
