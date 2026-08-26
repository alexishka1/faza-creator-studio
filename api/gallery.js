import { getSupabaseAdmin, setCorsHeaders } from './_lib.js';
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES } from '../src/data/portfolio.js';

/**
 * GET /api/gallery?category=xxx
 * Fetch foto galeri dari database. Fallback ke data static jika DB kosong.
 * Komponen tampilan hanya perlu membaca field url_foto — tidak bergantung provider.
 */
export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { category } = req.query;

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('galeri')
      .select('id, url_foto, caption, kategori, urutan, created_at')
      .order('urutan', { ascending: true })
      .order('created_at', { ascending: false });

    if (category && category !== 'all' && category !== 'All') {
      query = query.eq('kategori', category);
    }

    const { data: rows, error } = await query;

    if (!error && rows && rows.length > 0) {
      const items = rows.map((g) => ({
        id:       g.id,
        url_foto: g.url_foto,    // ← field utama, tidak hardcode provider
        title:    g.caption || '',
        category: g.kategori || 'Studio & Space',
      }));

      // Kumpulkan kategori unik dari database
      const { data: catRows } = await supabase
        .from('galeri')
        .select('kategori')
        .not('kategori', 'is', null);

      const dbCategories = catRows
        ? ['All', ...new Set(catRows.map((r) => r.kategori).filter(Boolean))]
        : PORTFOLIO_CATEGORIES;

      return res.status(200).json({ source: 'database', items, categories: dbCategories });
    }
  } catch (err) {
    console.warn('[api/gallery] Supabase error, falling back to static:', err.message);
  }

  // Graceful fallback — normalisasi ke shape yang sama
  let fallbackItems = PORTFOLIO_ITEMS.map((item) => ({
    id:       item.id,
    url_foto: item.desktopSrc,   // map ke url_foto
    title:    item.title,
    category: item.category,
  }));

  if (category && category !== 'all' && category !== 'All') {
    fallbackItems = fallbackItems.filter((i) => i.category === category);
  }

  return res.status(200).json({
    source: 'fallback',
    items: fallbackItems,
    categories: PORTFOLIO_CATEGORIES,
  });
}
