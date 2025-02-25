import { createClient, PostgrestError } from '@supabase/supabase-js'

if (typeof process.env.SUPABASE_URL !== 'string' || typeof process.env.SUPABASE_ANON_KEY !== 'string') {
  throw new Error('Missing env var');
}

export default createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);