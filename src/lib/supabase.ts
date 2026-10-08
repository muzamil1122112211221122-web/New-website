import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://glvdbjkvkhuhssutkmpb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdmRiamt2a2h1aHNzdXRrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzk0MjcsImV4cCI6MjEwNjk1NTQyN30.FDAycFUf0eqTKhiMOQO5dXNchYj7Jp-QE-8F8O5TPwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
