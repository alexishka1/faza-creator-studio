import { getSupabaseAdmin, ALL_SLOTS, setCorsHeaders } from './_lib.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nama, email, phone, layanan, tanggal, jam, pesan, honeypot } = req.body;

  // 1. Anti-bot honeypot
  if (honeypot) return res.status(400).json({ error: 'Bot detected' });

  // 2. Validate required fields (pesan is optional)
  if (!nama || !email || !phone || !layanan || !tanggal || !jam) {
    return res.status(400).json({ error: 'Nama, email, no WA, paket layanan, tanggal, dan jam wajib diisi.' });
  }

  // 3. Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' });
  }

  // 4. Validate jam is a known slot
  if (!ALL_SLOTS.includes(jam)) {
    return res.status(400).json({ error: 'Jam sesi tidak valid.' });
  }

  // 5. Sanitize inputs
  const clean = (s) => String(s || '').replace(/<[^>]*>/g, '').trim().slice(0, 1000);
  const data = {
    nama: clean(nama),
    email: clean(email).toLowerCase(),
    phone: clean(phone),
    layanan: clean(layanan),
    tanggal: clean(tanggal),
    jam,
    pesan: clean(pesan || '-'),
    ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
  };

  const supabase = getSupabaseAdmin();

  // 6. Check if slot is already booked
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('tanggal', data.tanggal)
    .eq('jam', data.jam)
    .in('status', ['pending', 'confirmed'])
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'Slot waktu ini sudah terisi. Pilih waktu lain.' });
  }

  // 7. Check if slot is blocked by admin
  const { data: blocked } = await supabase
    .from('blocked_slots')
    .select('id')
    .eq('tanggal', data.tanggal)
    .or(`jam.eq.${data.jam},jam.is.null`)
    .maybeSingle();

  if (blocked) {
    return res.status(409).json({ error: 'Tanggal atau waktu ini tidak tersedia. Pilih waktu lain.' });
  }

  // 8. Save to database
  const { data: booking, error: dbError } = await supabase
    .from('bookings')
    .insert([data])
    .select()
    .single();

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return res.status(500).json({ error: 'Gagal menyimpan booking. Coba lagi.' });
  }

  // 9. Send notification email to admin (non-blocking)
  sendAdminEmail(booking).catch((e) => console.error('Email error:', e));

  return res.status(200).json({
    success: true,
    message: 'Booking berhasil dikirim! Kami akan menghubungi Anda segera.',
    bookingId: booking.id,
  });
}

async function sendAdminEmail(booking) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  const layananLabels = {
    'Studio Rent / Jam': '🏢 Studio Rent / Jam',
    'Weekdays Happy Hour': '⚡ Weekdays Happy Hour',
    'Together Moment': '👥 Together Moment',
    'LinkedIn Portrait': '👔 LinkedIn Portrait',
    'Editorial & Fashion': '✨ Editorial & Fashion',
    'Product & Commercial': '📦 Product & Commercial',
    'Sewa Ruang ½ / Full-Day': '🎬 Sewa Ruang ½ / Full-Day',
    'Podcast Bundle': '🎙️ Podcast Bundle',
    'Retainer Bulanan': '🤝 Retainer Bulanan',
  };

  await resend.emails.send({
    from: 'Faza Studio <onboarding@resend.dev>',
    to: process.env.ADMIN_EMAIL || 'dewadp08@gmail.com',
    subject: `📸 Booking Baru: ${booking.nama} — ${booking.layanan}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;">
        <div style="margin-bottom:32px;">
          <p style="font-size:12px;letter-spacing:0.3em;color:#666;text-transform:uppercase;margin:0 0 8px;">Faza Studio</p>
          <h1 style="font-size:24px;margin:0;font-weight:400;font-family:Georgia,serif;">📸 Booking Baru Masuk!</h1>
          <p style="color:#888;margin:8px 0 0;font-size:14px;">Segera konfirmasi atau tolak di dashboard admin.</p>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          ${[
            ['Nama', booking.nama],
            ['Email', booking.email],
            ['No. WA', booking.phone],
            ['Layanan', layananLabels[booking.layanan] || booking.layanan],
            ['Tanggal', booking.tanggal],
            ['Jam', booking.jam],
            ['Pesan', booking.pesan],
          ].map(([label, val]) => `
            <tr style="border-bottom:1px solid #1a1a1a;">
              <td style="padding:12px 0;color:#666;font-size:13px;width:100px;">${label}</td>
              <td style="padding:12px 0;color:#fff;font-size:13px;">${val || '-'}</td>
            </tr>
          `).join('')}
        </table>

        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #1a1a1a;font-size:11px;color:#555;">
          Booking ID: ${booking.id} · ${new Date().toLocaleString('id-ID')}
        </div>
      </div>
    `,
  });
}
