import { createClient } from '@supabase/supabase-js';

// Supabase client untuk dipakai di semua API serverless functions
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables. Check VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY.');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const ALL_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

// CORS headers untuk semua API responses
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, Authorization');
}
