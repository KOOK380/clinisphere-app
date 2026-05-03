/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Helper to get env vars reliably in both Vite (client) and Node (server) environments
const getEnv = (key: string) => {
  // @ts-ignore - Handle Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // @ts-ignore - Handle Node's process.env
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials missing!');
  console.log('SUPABASE_URL exists:', !!supabaseUrl);
  console.log('SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
}

let supabaseInstance: any = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.error('Supabase credentials missing during initialization.');
  }
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
}

export const supabase = supabaseInstance;
export default supabase;
