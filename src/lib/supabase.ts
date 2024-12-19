import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fdc692d3-fffd-4393-94eb-e68f95305a81.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYzY5MmQzLWZmZmQtNDM5My05NGViLWU2OGY5NTMwNWE4MSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzAzMDY4OTgxLCJleHAiOjIwMTg2NDQ5ODF9.ZenIxUuqGm2JU_1dGSQYcw2knkqXXWwLXvH_TdZE0Yw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);