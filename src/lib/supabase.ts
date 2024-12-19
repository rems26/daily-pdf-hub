import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dfrlowjwfezvxrlhxwad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcmxvd2p3ZmV6dnhybGh4d2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTE5NjgsImV4cCI6MjA0ODk4Nzk2OH0.pgH4Y5CST_YE7bE2a7WeYojiFsPJW60isNGt9ibcWiM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);