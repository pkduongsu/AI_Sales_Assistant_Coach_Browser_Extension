import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl, supabaseKey,
  {
  // Provide a custom schema. Defaults to "public".
  db: { schema: 'assistant' }
});

export default supabase;