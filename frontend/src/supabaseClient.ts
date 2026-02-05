import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.debug('Initializing Supabase Client...');
console.debug('URL:', supabaseUrl ? 'Set' : 'Missing');
console.debug('Cilent Key:', supabasePublishableKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('CRITICAL: Supabase environment variables are missing!');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
