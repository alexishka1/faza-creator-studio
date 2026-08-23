import { getSupabaseAdmin, setCorsHeaders } from '../_lib.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth check on all methods
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin key.' });
  }

  const supabase = getSupabaseAdmin();

  // ─── GET: Fetch all bookings & blocked slots ────────────────────
  if (req.method === 'GET') {
    const { status, tanggal, limit = 100 } = req.query;

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (status && status !== 'all') query = query.eq('status', status);
    if (tanggal) query = query.eq('tanggal', tanggal);

    const { data: bookingsData, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    // Fetch all active blocked slots
    const { data: blockedSlotsData, error: blkErr } = await supabase
      .from('blocked_slots')
      .select('*')
      .order('tanggal', { ascending: true });

    // Stats
    const stats = {
      total: bookingsData?.length || 0,
      pending: bookingsData?.filter((b) => b.status === 'pending').length || 0,
      confirmed: bookingsData?.filter((b) => b.status === 'confirmed').length || 0,
      cancelled: bookingsData?.filter((b) => b.status === 'cancelled').length || 0,
      blocked: blockedSlotsData?.length || 0,
    };

    return res.status(200).json({
      bookings: bookingsData || [],
      blockedSlots: blockedSlotsData || [],
      stats,
    });
  }

  // ─── PATCH: Update booking status ────────────────────────────────
  if (req.method === 'PATCH') {
    const { id, status } = req.body;

    if (!id) return res.status(400).json({ error: 'ID booking diperlukan.' });
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status harus "confirmed" atau "cancelled".' });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // Send email to client (non-blocking)
    sendClientEmail(booking, status).catch((e) => console.error('Client email error:', e));

    return res.status(200).json({ success: true, booking });
  }

  // ─── POST: Block a date/slot ──────────────────────────────────────
  if (req.method === 'POST') {
    const { tanggal, jam, alasan } = req.body;
    if (!tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      return res.status(400).json({ error: 'Tanggal tidak valid.' });
    }

    const { data, error } = await supabase
      .from('blocked_slots')
      .insert([{ tanggal, jam: jam || null, alasan: alasan || null }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, blocked: data });
  }

  // ─── DELETE: Remove a block ───────────────────────────────────────
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID diperlukan.' });

    const { error } = await supabase.from('blocked_slots').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function sendClientEmail(booking, status) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  const isConfirmed = status === 'confirmed';

  await resend.emails.send({
    from: 'Faza Studio <onboarding@resend.dev>',
    to: booking.email,
    subject: isConfirmed
      ? `✅ Booking Anda Dikonfirmasi — Faza Studio`
      : `❌ Booking Anda Tidak Dapat Diproses — Faza Studio`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;">
        <p style="font-size:12px;letter-spacing:0.3em;color:#666;text-transform:uppercase;margin:0 0 16px;">Faza Studio</p>
        
        <h1 style="font-size:24px;font-weight:400;font-family:Georgia,serif;color:${isConfirmed ? '#4ade80' : '#f87171'};margin:0 0 8px;">
          ${isConfirmed ? '✅ Booking Dikonfirmasi!' : '❌ Booking Tidak Dapat Diproses'}
        </h1>
        
        <p style="color:#888;font-size:14px;margin:0 0 32px;">
          ${isConfirmed
            ? `Halo <strong style="color:#fff">${booking.nama}</strong>, booking Anda telah kami konfirmasi. Sampai jumpa di studio!`
            : `Halo <strong style="color:#fff">${booking.nama}</strong>, mohon maaf booking Anda tidak dapat kami proses saat ini. Silakan hubungi kami untuk penjadwalan ulang.`
          }
        </p>

        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          ${[
            ['Layanan', booking.layanan],
            ['Tanggal', booking.tanggal],
            ['Jam', booking.jam],
          ].map(([l, v]) => `
            <tr style="border-bottom:1px solid #1a1a1a;">
              <td style="padding:10px 0;color:#666;font-size:13px;width:90px;">${l}</td>
              <td style="padding:10px 0;color:#fff;font-size:13px;">${v}</td>
            </tr>
          `).join('')}
        </table>

        ${isConfirmed ? `
        <div style="background:#111;border-radius:8px;padding:20px;border-left:3px solid #4ade80;margin-bottom:24px;">
          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">Alamat Studio</p>
          <p style="margin:0;color:#fff;font-size:14px;">Jl. Dukuh V No 79, Jakarta Timur, 13350</p>
        </div>
        ` : ''}

        <p style="font-size:13px;color:#666;">
          Ada pertanyaan? Chat kami via 
          <a href="https://wa.me/6285933585829" style="color:#fff;">WhatsApp</a>
        </p>

        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1a1a1a;font-size:11px;color:#444;">
          Booking ID: ${booking.id}
        </div>
      </div>
    `,
  });
}
