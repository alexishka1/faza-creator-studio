import { getSupabaseAdmin, ALL_SLOTS, setCorsHeaders } from './_lib.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { tanggal } = req.query;
  if (!tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    return res.status(400).json({ error: 'Parameter tanggal tidak valid (format: YYYY-MM-DD).' });
  }

  // Block dates in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requestedDate = new Date(tanggal);
  if (requestedDate < today) {
    return res.status(200).json({
      slots: ALL_SLOTS.map((jam) => ({ jam, available: false })),
    });
  }

  const supabase = getSupabaseAdmin();

  // Get all active bookings for this date
  const { data: bookings, error: bErr } = await supabase
    .from('bookings')
    .select('jam')
    .eq('tanggal', tanggal)
    .in('status', ['pending', 'confirmed']);

  if (bErr) {
    console.error('Availability fetch error:', bErr);
    return res.status(500).json({ error: 'Gagal mengambil data ketersediaan.' });
  }

  // Get all blocked slots for this date
  const { data: blocked, error: blErr } = await supabase
    .from('blocked_slots')
    .select('jam')
    .eq('tanggal', tanggal);

  if (blErr) {
    console.error('Blocked slots fetch error:', blErr);
    return res.status(500).json({ error: 'Gagal mengambil data blokir.' });
  }

  const bookedJams = (bookings || []).map((b) => b.jam?.slice(0, 5));
  const blockedData = blocked || [];

  // If any blocked_slot entry has jam=null → whole day is blocked
  const isWholeDay = blockedData.some((b) => b.jam === null);
  const blockedJams = blockedData.filter((b) => b.jam !== null).map((b) => b.jam?.slice(0, 5));

  const slots = ALL_SLOTS.map((jam) => ({
    jam,
    available: !isWholeDay && !bookedJams.includes(jam) && !blockedJams.includes(jam),
  }));

  // Set cache header: revalidate every 30 seconds
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
  return res.status(200).json({ slots, tanggal });
}
