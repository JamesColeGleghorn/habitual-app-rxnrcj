import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://tylsyqzwhpjvkzuijmtf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHN5cXp3aHBqdmt6dWlqbXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzA3NzAsImV4cCI6MjA4MDM0Njc3MH0.qVCt8Hqc-QvZfI0f-M-1XPzevqbjYSBS2bcpZJZmRjw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
