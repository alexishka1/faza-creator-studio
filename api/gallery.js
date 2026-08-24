import { getSupabaseAdmin, setCorsHeaders } from './_lib.js';
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES } from '../src/data/portfolio.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category } = req.query;

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('galeri')
      .select('*')
      .order('order_index', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: dbGallery, error } = await query;

    if (!error && dbGallery && dbGallery.length > 0) {
      const items = dbGallery.map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        desktopSrc: g.desktop_src,
        mobileSrc: g.mobile_src,
      }));
      return res.status(200).json({ source: 'database', items, categories: PORTFOLIO_CATEGORIES });
    }
  } catch (err) {
    console.warn('Supabase fetch galeri error, falling back to static config:', err);
  }

  // Graceful fallback to static portfolio items
  let fallbackItems = PORTFOLIO_ITEMS;
  if (category && category !== 'all') {
    fallbackItems = fallbackItems.filter((i) => i.category === category);
  }

  return res.status(200).json({
    source: 'fallback',
    items: fallbackItems,
    categories: PORTFOLIO_CATEGORIES,
  });
}
