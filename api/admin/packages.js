import { getSupabaseAdmin, setCorsHeaders } from '../_lib.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

/**
 * Admin Packages API — auth-protected
 * PATCH /api/admin/packages → update harga, status, nama, atau url_foto
 */
export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabaseAdmin();

  // ── Auth ────────────────────────────────────────────────────
  let authenticated = false;

  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) authenticated = true;
    } catch (e) {
      console.warn('[admin/packages] Auth error:', e.message);
    }
  }

  const adminKey = req.headers['x-admin-key'];
  if (!authenticated && adminKey === ADMIN_PASSWORD) authenticated = true;

  if (!authenticated) return res.status(401).json({ error: 'Unauthorized.' });

  // ── PATCH — update paket ────────────────────────────────────
  if (req.method === 'PATCH') {
    const { id, harga, status, nama, subtitle, url_foto } = req.body;
    if (!id) return res.status(400).json({ error: 'ID paket diperlukan.' });

    const updates = {};
    // Terima field baru (nama kolom DB) atau field lama (backward compat)
    if (harga     !== undefined) updates.harga     = harga;
    if (status    !== undefined) updates.status    = status;
    if (nama      !== undefined) updates.nama      = nama;
    if (subtitle  !== undefined) updates.subtitle  = subtitle;
    if (url_foto  !== undefined) updates.url_foto  = url_foto;
    // Backward compat: ServiceManager masih kirim 'price' dan 'title'
    if (req.body.price !== undefined) updates.harga = req.body.price;
    if (req.body.title !== undefined) updates.nama  = req.body.title;

    const { data, error } = await supabase
      .from('paket')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn('[admin/packages] Update error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, package: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
