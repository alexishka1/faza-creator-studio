import { getSupabaseAdmin, setCorsHeaders } from '../_lib.js';
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES } from '../../src/data/portfolio.js';

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
      console.warn('Auth error:', e);
    }
  }

  const adminKey = req.headers['x-admin-key'];
  if (!authenticated && adminKey && adminKey === ADMIN_PASSWORD) {
    authenticated = true;
  }

  if (!authenticated) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  // 2. GET: Fetch all gallery items
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        const items = data.map((g) => ({
          id: g.id,
          title: g.title,
          category: g.category,
          desktopSrc: g.desktop_src,
          mobileSrc: g.mobile_src,
        }));
        return res.status(200).json({ items, categories: PORTFOLIO_CATEGORIES });
      }
    } catch (e) {
      console.warn('DB fetch error, falling back:', e);
    }

    return res.status(200).json({ items: PORTFOLIO_ITEMS, categories: PORTFOLIO_CATEGORIES });
  }

  // 3. POST: Add new photo to database
  if (req.method === 'POST') {
    const { title, category, imageUrl, fileBase64, fileName } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Judul foto dan kategori wajib diisi.' });
    }

    let finalImageUrl = imageUrl;

    // If uploading raw file data, upload to Supabase Storage bucket 'gallery'
    if (fileBase64 && fileName) {
      try {
        const buffer = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const cleanFileName = `gallery-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const { data: storageData, error: storageErr } = await supabase.storage
          .from('gallery')
          .upload(cleanFileName, buffer, {
            contentType: 'image/webp',
            upsert: true,
          });

        if (!storageErr && storageData) {
          const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(cleanFileName);
          finalImageUrl = publicUrlData.publicUrl;
        } else {
          // If storage bucket is not created, fallback to data URL or given image URL
          console.warn('Storage upload note:', storageErr?.message);
        }
      } catch (uploadErr) {
        console.warn('Storage upload error:', uploadErr);
      }
    }

    if (!finalImageUrl) {
      return res.status(400).json({ error: 'URL atau file foto wajib diisi.' });
    }

    const newId = `gal-${Date.now()}`;
    const newRecord = {
      id: newId,
      title: title.trim(),
      category: category.trim(),
      desktop_src: finalImageUrl,
      mobile_src: finalImageUrl,
      order_index: 0,
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await supabase
      .from('galeri')
      .insert([newRecord])
      .select()
      .single();

    if (insertErr) {
      console.warn('Supabase insert note:', insertErr.message);
      // Return optimistic response
      return res.status(200).json({
        success: true,
        item: {
          id: newId,
          title: newRecord.title,
          category: newRecord.category,
          desktopSrc: newRecord.desktop_src,
          mobileSrc: newRecord.mobile_src,
        },
      });
    }

    return res.status(200).json({
      success: true,
      item: {
        id: inserted.id,
        title: inserted.title,
        category: inserted.category,
        desktopSrc: inserted.desktop_src,
        mobileSrc: inserted.mobile_src,
      },
    });
  }

  // 4. DELETE: Remove photo from database
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID foto diperlukan.' });

    const { error } = await supabase.from('galeri').delete().eq('id', id);
    if (error) {
      console.warn('Delete note:', error.message);
    }

    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
