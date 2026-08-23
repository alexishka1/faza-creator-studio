import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';
import BookingCalendar from '../components/BookingCalendar';
import { LAYANAN_OPTIONS } from '../data/services';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const initialLayanan = searchParams.get('layanan') || '';

  const [form, setForm] = useState({
    nama: '',
    email: '',
    phone: '',
    layanan: initialLayanan,
    tanggal: '',
    jam: '',
    pesan: '',
    honeypot: '', // anti-bot field (hidden)
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // Sync if search param changes or is passed
  useEffect(() => {
    const paramLayanan = searchParams.get('layanan');
    if (paramLayanan) {
      // Find matching option (case-insensitive or partial match)
      const found = LAYANAN_OPTIONS.find(
        (opt) =>
          opt.value.toLowerCase().includes(paramLayanan.toLowerCase()) ||
          paramLayanan.toLowerCase().includes(opt.value.toLowerCase())
      );
      if (found) {
        setForm((prev) => ({ ...prev, layanan: found.value }));
      } else {
        setForm((prev) => ({ ...prev, layanan: paramLayanan }));
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!form.layanan) {
      setErrorMsg('Pilih jenis paket layanan yang Anda inginkan.');
      setStatus('error');
      return;
    }

    if (!form.tanggal || !form.jam) {
      setErrorMsg('Pilih tanggal dan jam sesi terlebih dahulu pada kalender.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Terjadi kesalahan. Coba lagi.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      setStatus('error');
    }
  };

  // SUCCESS STATE VIEW
  if (status === 'success') {
    return (
      <PageTransition>
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '600px', width: '100%', background: '#0e0c0a', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '12px', padding: '3rem 2.5rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <p style={{ color: 'var(--color-accent, #c9a96e)', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              RESERVASI BERHASIL
            </p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#fff', marginBottom: '1.2rem' }}>
              Terima Kasih, {form.nama}!
            </h2>
            <p style={{ color: 'var(--color-text-secondary, rgba(255,255,255,0.7))', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem' }}>
              Permintaan booking Anda untuk <strong style={{ color: '#fff' }}>{form.layanan}</strong> pada <strong style={{ color: '#fff' }}>{form.tanggal}</strong> pukul <strong style={{ color: '#fff' }}>{form.jam} WIB</strong> telah masuk ke sistem kami. Tim Faza Studio akan segera mengonfirmasi ketersediaan Anda.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" style={{
                padding: '0.9rem 2rem', background: '#fff', color: '#000',
                textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.8rem',
                fontWeight: 600, letterSpacing: '0.12em', borderRadius: '4px'
              }}>
                Kembali ke Beranda
              </Link>
              <a
                href={`https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20${encodeURIComponent(form.nama)}%20baru%20saja%20mengisi%20form%20booking%20untuk%20sesi%20${encodeURIComponent(form.layanan)}%20pada%20${form.tanggal}%20pukul%20${form.jam}.`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.9rem 2rem', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#fff',
                  textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.8rem',
                  fontWeight: 600, letterSpacing: '0.12em', borderRadius: '4px',
                  background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                  boxShadow: '0 6px 22px var(--color-wa-glow, rgba(36, 215, 87, 0.45))'
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '16px', color: '#fff' }} />
                Konfirmasi via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div style={{ background: 'var(--color-bg)', color: '#fff', minHeight: '100vh', paddingTop: 'clamp(10vh, 18vh, 18vh)', paddingBottom: '10vh' }}>
        <div style={{ width: '90%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>

          {/* Left Column: Studio Contact & Location Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ flex: '1 1 380px' }}
          >
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-accent, #c9a96e)', marginBottom: '1rem', fontWeight: 600 }}>
              ● RESERVASI STUDIO
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)', lineHeight: 1.1, marginBottom: '1.8rem' }}>
              WUJUDKAN<br />KARYA ANDA.
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '90%' }}>
              Pilih paket foto atau sewa ruang studio sesuai kebutuhan Anda. Lengkapi form di samping untuk mengamankan slot jadwal pilihan Anda.
            </p>

            <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent, #c9a96e)', marginBottom: '0.5rem', fontWeight: 600 }}>Lokasi Studio</h4>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, margin: 0, color: '#fff' }}>
                Jl. Dukuh V No 79, RT.05/RW.02, Kramat Jati / Ciracas<br />
                Jakarta Timur, DKI Jakarta 13550
              </p>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent, #c9a96e)', marginBottom: '0.5rem', fontWeight: 600 }}>Kontak Langsung</h4>
              <p style={{ fontSize: '1.05rem', margin: '0 0 0.3rem', color: '#fff' }}>dewadp08@gmail.com</p>
              <p style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-wa-light, #2fe668)', fontWeight: 600 }}>+62 859-3358-5829</p>
            </div>

            <a
              href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20ingin%20tanya%20jadwal%20dan%20paket%20studio."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.7rem',
                padding: '1rem 2.2rem',
                background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontSize: '0.82rem', fontWeight: 600, borderRadius: '50px',
                boxShadow: '0 6px 22px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#fff' }} />
              Chat via WhatsApp
            </a>
          </motion.div>

          {/* Right Column: Interactive Form + Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ flex: '1 1 520px', background: '#0e0c0a', padding: 'clamp(2rem, 5vw, 3.5rem)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>

              {/* Honeypot Anti-Bot Field */}
              <input
                type="text"
                name="honeypot"
                value={form.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              {/* Nama */}
              <div>
                <label style={labelStyle}>Nama Lengkap *</label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  type="text"
                  placeholder="Contoh: Aditya Pratama"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Email & Phone Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Alamat Email *</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="nama@email.com"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nomor WhatsApp *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="08123456789"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Layanan Dropdown */}
              <div>
                <label style={labelStyle}>Pilih Paket Layanan *</label>
                <select
                  name="layanan"
                  value={form.layanan}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    color: form.layanan ? '#fff' : 'rgba(255,255,255,0.4)',
                    background: '#0e0c0a',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled style={{ background: '#14110f', color: '#888' }}>
                    — Pilih Paket / Layanan —
                  </option>
                  {LAYANAN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: '#14110f', color: '#fff' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Calendar & Slot Selection */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <label style={{ ...labelStyle, margin: 0 }}>Jadwal & Waktu Sesi *</label>
                  {form.tanggal && form.jam && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent, #c9a96e)', fontWeight: 600 }}>
                      📅 {form.tanggal} · 🕐 {form.jam} WIB
                    </span>
                  )}
                </div>

                <BookingCalendar
                  selectedDate={form.tanggal}
                  onDateSelect={(d) => {
                    setForm((p) => ({ ...p, tanggal: d }));
                    setErrorMsg('');
                  }}
                  selectedSlot={form.jam}
                  onSlotSelect={(j) => {
                    setForm((p) => ({ ...p, jam: j }));
                    setErrorMsg('');
                  }}
                />
              </div>

              {/* Pesan / Catatan Khusus */}
              <div>
                <label style={labelStyle}>Detail Proyek / Catatan Khusus (Opsional)</label>
                <textarea
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ceritakan konsep pemotretan, jumlah orang, atau request khusus..."
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              {/* Error Alert Display */}
              {status === 'error' && (
                <p style={{ color: '#f87171', fontSize: '0.88rem', padding: '0.8rem 1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '6px', border: '1px solid rgba(248,113,113,0.2)', margin: 0 }}>
                  ⚠️ {errorMsg}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  alignSelf: 'flex-start', padding: '1.1rem 2.8rem',
                  background: status === 'loading' ? 'rgba(255,255,255,0.2)' : 'var(--color-accent, #c9a96e)',
                  border: 'none', color: '#000',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  fontSize: '0.85rem', fontWeight: 600,
                  borderRadius: '4px',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease', marginTop: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => {
                  if (status !== 'loading') {
                    e.currentTarget.style.background = '#dfc28d';
                  }
                }}
                onMouseLeave={(e) => {
                  if (status !== 'loading') {
                    e.currentTarget.style.background = 'var(--color-accent, #c9a96e)';
                  }
                }}
              >
                {status === 'loading' ? 'Mengirim Data...' : 'Kirim Permintaan Reservasi ↗'}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '0.4rem',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  fontSize: '0.95rem',
  padding: '0.8rem 0',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.3s',
};

export default Booking;
