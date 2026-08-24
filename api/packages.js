import { getSupabaseAdmin, setCorsHeaders } from './_lib.js';
import { B2C_SERVICES, B2B_SERVICES } from '../src/data/services.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: dbPackages, error } = await supabase
      .from('paket')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && dbPackages && dbPackages.length > 0) {
      const b2c = dbPackages.filter((p) => p.category === 'b2c');
      const b2b = dbPackages.filter((p) => p.category === 'b2b');
      return res.status(200).json({ source: 'database', b2c, b2b });
    }
  } catch (err) {
    console.warn('Supabase fetch paket error, falling back to static config:', err);
  }

  // Graceful fallback to centralized single source of truth
  return res.status(200).json({
    source: 'fallback',
    b2c: B2C_SERVICES,
    b2b: B2B_SERVICES,
  });
}
