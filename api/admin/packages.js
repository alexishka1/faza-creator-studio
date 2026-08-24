import { getSupabaseAdmin, setCorsHeaders } from '../_lib.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. Auth check
  const supabase = getSupabaseAdmin();
  let authenticated = false;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) authenticated = true;
    } catch (e) {
      console.warn('Auth token error:', e);
    }
  }

  const adminKey = req.headers['x-admin-key'];
  if (!authenticated && adminKey && adminKey === ADMIN_PASSWORD) {
    authenticated = true;
  }

  if (!authenticated) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  // 2. PATCH: Update package price or status
  if (req.method === 'PATCH') {
    const { id, price, status, title, subtitle } = req.body;
    if (!id) return res.status(400).json({ error: 'ID paket diperlukan.' });

    const updates = {};
    if (price !== undefined) updates.price = price;
    if (status !== undefined) updates.status = status;
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('paket')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, package: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
