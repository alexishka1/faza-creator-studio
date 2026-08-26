import { getSupabaseAdmin, setCorsHeaders } from '../_lib.js';
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES } from '../../src/data/portfolio.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

/**
 * Admin Gallery API — auth-protected
 * GET    /api/admin/gallery        → list all items
 * POST   /api/admin/gallery        → upload foto baru (file atau URL)
 * DELETE /api/admin/gallery        → hapus foto by id
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
      console.warn('[admin/gallery] Auth error:', e.message);
    }
  }

  const adminKey = req.headers['x-admin-key'];
  if (!authenticated && adminKey === ADMIN_PASSWORD) authenticated = true;

  if (!authenticated) return res.status(401).json({ error: 'Unauthorized.' });

  // ── GET — list all ──────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('id, url_foto, caption, kategori, urutan, created_at')
        .order('urutan', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data) {
        const items = data.map((g) => ({
          id:       g.id,
          url_foto: g.url_foto,
          title:    g.caption || '',
          category: g.kategori || '',
        }));
        return res.status(200).json({ items, categories: PORTFOLIO_CATEGORIES });
      }
    } catch (e) {
      console.warn('[admin/gallery] GET error, falling back:', e.message);
    }

    return res.status(200).json({
      items: PORTFOLIO_ITEMS.map((i) => ({ ...i, url_foto: i.desktopSrc })),
      categories: PORTFOLIO_CATEGORIES,
    });
  }

  // ── POST — upload foto baru ─────────────────────────────────
  if (req.method === 'POST') {
    const { title, category, imageUrl, fileBase64, fileName } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Judul foto dan kategori wajib diisi.' });
    }

    let finalUrl = imageUrl || null;

    // Upload file ke Supabase Storage jika ada base64
    if (fileBase64 && fileName) {
      try {
        const base64Data = fileBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const cleanName = `gallery-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}.webp`;

        const { data: storageData, error: storageErr } = await supabase.storage
          .from('gallery')
          .upload(cleanName, buffer, {
            contentType: 'image/webp',
            upsert: false,
          });

        if (!storageErr && storageData) {
          const { data: pub } = supabase.storage.from('gallery').getPublicUrl(cleanName);
          finalUrl = pub.publicUrl;  // ← URL public Supabase Storage
        } else {
          console.warn('[admin/gallery] Storage upload:', storageErr?.message);
        }
      } catch (uploadErr) {
        console.warn('[admin/gallery] Upload exception:', uploadErr.message);
      }
    }

    if (!finalUrl) {
      return res.status(400).json({ error: 'URL atau file foto wajib diisi.' });
    }

    const newId = `gal-${Date.now()}`;
    const record = {
      id:       newId,
      url_foto: finalUrl,       // ← simpan di url_foto saja
      caption:  title.trim(),
      kategori: category.trim(),
      urutan:   0,
    };

    const { data: inserted, error: insertErr } = await supabase
      .from('galeri')
      .insert([record])
      .select()
      .single();

    if (insertErr) {
      console.warn('[admin/gallery] Insert error:', insertErr.message);
      // Return optimistic response agar UI tetap update
      return res.status(200).json({
        success: true,
        item: { id: newId, url_foto: finalUrl, title: record.caption, category: record.kategori },
      });
    }

    return res.status(200).json({
      success: true,
      item: {
        id:       inserted.id,
        url_foto: inserted.url_foto,
        title:    inserted.caption,
        category: inserted.kategori,
      },
    });
  }

  // ── DELETE — hapus foto ─────────────────────────────────────
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID foto diperlukan.' });

    // Ambil URL dulu untuk hapus dari Storage
    try {
      const { data: row } = await supabase
        .from('galeri')
        .select('url_foto')
        .eq('id', id)
        .single();

      if (row?.url_foto) {
        // Extract filename dari Supabase Storage URL
        const urlObj = new URL(row.url_foto);
        const pathParts = urlObj.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        if (fileName) {
          await supabase.storage.from('gallery').remove([fileName]);
        }
      }
    } catch (e) {
      console.warn('[admin/gallery] Storage delete note:', e.message);
    }

    const { error } = await supabase.from('galeri').delete().eq('id', id);
    if (error) console.warn('[admin/gallery] DB delete note:', error.message);

    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
