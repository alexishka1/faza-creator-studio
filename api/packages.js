import { getSupabaseAdmin, setCorsHeaders } from './_lib.js';
import { B2C_SERVICES, B2B_SERVICES } from '../src/data/services.js';

/**
 * GET /api/packages
 * Fetch semua paket dari database. Fallback ke data static jika DB kosong.
 * Response tidak menyertakan field provider-specific — hanya url_foto.
 */
export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const supabase = getSupabaseAdmin();
    const { data: rows, error } = await supabase
      .from('paket')
      .select('id, nama, subtitle, kategori, harga, tag, deskripsi, fitur, url_foto, status, urutan')
      .eq('status', 'aktif')
      .order('urutan', { ascending: true });

    if (!error && rows && rows.length > 0) {
      // Normalize ke shape yang dipakai komponen: field name tidak bergantung provider
      const normalize = (row) => ({
        id:         row.id,
        title:      row.nama,
        subtitle:   row.subtitle || '',
        kategori:   row.kategori,
        price:      row.harga,
        tag:        row.tag || '',
        desc:       row.deskripsi || '',
        features:   row.fitur || [],
        url_foto:   row.url_foto || null,   // ← satu-satunya field URL foto
        status:     row.status,
      });

      const b2c = rows.filter((p) => p.kategori === 'b2c').map(normalize);
      const b2b = rows.filter((p) => p.kategori === 'b2b').map(normalize);
      return res.status(200).json({ source: 'database', b2c, b2b });
    }
  } catch (err) {
    console.warn('[api/packages] Supabase error, falling back to static:', err.message);
  }

  // Graceful fallback — static data dari services.js
  // Normalisasi ke format yang sama (url_foto = field lama desktopImg)
  const normalizeFallback = (s) => ({
    ...s,
    kategori:  s.id ? 'b2c' : 'b2b',
    url_foto:  s.desktopImg || null,
  });

  return res.status(200).json({
    source: 'fallback',
    b2c: B2C_SERVICES.map((s) => ({ ...s, url_foto: s.desktopImg || null, kategori: 'b2c' })),
    b2b: B2B_SERVICES.map((s) => ({ ...s, url_foto: s.desktopImg || null, kategori: 'b2b' })),
  });
}
