import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';
import BookingCalendar from '../components/BookingCalendar';

const LAYANAN_OPTIONS = [
  // B2C Retail
  { value: 'Studio Rent / Jam', label: 'Studio Rent / Jam (Rp 150k-250k)' },
  { value: 'Weekdays Happy Hour', label: 'Weekdays Happy Hour (Rp 499.000)' },
  { value: 'Together Moment', label: 'Together Moment (Rp 699.000)' },
  { value: 'LinkedIn Portrait', label: 'LinkedIn Portrait (Rp 150.000)' },
  // B2B Creative Space
  { value: 'Editorial & Fashion', label: 'Editorial & Fashion (Rp 5.000.000)' },
  { value: 'Product & Commercial', label: 'Product & Commercial (Rp 2.000.000)' },
  { value: 'Sewa Ruang ½ / Full-Day', label: 'Sewa Ruang ½ / Full-Day (Rp 1.2jt-2jt)' },
  { value: 'Podcast Bundle', label: 'Podcast Bundle (Rp 850.000)' },
  { value: 'Retainer Bulanan', label: 'Retainer Bulanan (Mulai Rp 4.5jt/bln)' },
];

const Booking = () => {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    phone: '',
    layanan: '',
    tanggal: '',
    jam: '',
    pesan: '',
    honeypot: '', // anti-bot field (hidden)
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!form.tanggal || !form.jam) {
      setErrorMsg('Pilih tanggal dan jam sesi terlebih dahulu.');
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

  if (status === 'success') {
    return (
      <PageTransition>
        <div style={{
          background: 'var(--color-bg)', color: '#fff', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', textAlign: 'center', padding: '2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
              Booking Terkirim!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 2rem' }}>
              Terima kasih, <strong style={{ color: '#fff' }}>{form.nama}</strong>! Permintaan Anda sudah kami terima.
              Tim Faza Studio akan menghubungi Anda dalam 1×24 jam untuk konfirmasi.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
              Cek email <strong>{form.email}</strong> untuk detail booking.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/" style={{
                padding: '1rem 2rem', background: '#fff', color: '#000',
                textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.8rem',
                letterSpacing: '0.15em', borderRadius: '4px'
              }}>
                Kembali ke Home
              </a>
              <a href={`https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20${encodeURIComponent(form.nama)}%20baru%20saja%20mengisi%20form%20booking%20untuk%20sesi%20${encodeURIComponent(form.layanan)}%20pada%20${form.tanggal}%20pukul%20${form.jam}.`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
                  textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.8rem',
                  letterSpacing: '0.15em', borderRadius: '4px', background: '#25D366'
                }}>
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
      <div style={{ background: 'var(--color-bg)', color: '#fff', minHeight: '100vh', paddingTop: 'clamp(10vh, 20vh, 20vh)', paddingBottom: '10vh' }}>
        <div style={{ width: '90%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>

          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ flex: '1 1 400px' }}
          >
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Inquiries
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
              LET'S CREATE<br />TOGETHER.
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '80%' }}>
              Ceritakan visi Anda, dan biarkan kami yang mewujudkannya melalui lensa kamera. Isi formulir di samping atau hubungi kami secara langsung.
            </p>

            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>Studio Kami</h4>
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>Jl. Dukuh V No 79<br />Jakarta Timur, 13350</p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>Kontak Langsung</h4>
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>dewadp08@gmail.com</p>
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>+62 859-3358-5829</p>
            </div>

            <a
              href="https://wa.me/6285933585829"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '1rem',
                padding: '1.2rem 2.5rem', background: '#fff', color: '#000',
                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '50px',
                transition: 'transform 0.3s ease, background 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.background = '#ddd'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#fff'; }}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#25D366' }} />
              Chat via WhatsApp
            </a>
          </motion.div>

          {/* Right Column: Form + Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ flex: '1 1 500px', background: '#0a0a0a', padding: 'clamp(2rem, 5vw, 4rem)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

              {/* Honeypot (hidden) */}
              <input
                type="text"
                name="honeypot"
                value={form.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <input name="nama" value={form.nama} onChange={handleChange} type="text" placeholder="Nama Lengkap" required style={inputStyle} />
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Alamat Email" required style={inputStyle} />
                <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Nomor WhatsApp (contoh: 08123456789)" required style={inputStyle} />
              </div>

              {/* Pilih Layanan */}
              <div>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
                  Pilih Layanan
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {LAYANAN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, layanan: opt.value }))}
                      style={{
                        padding: '0.8rem 1rem',
                        border: form.layanan === opt.value
                          ? '1px solid #fff'
                          : '1px solid rgba(255,255,255,0.12)',
                        background: form.layanan === opt.value ? '#fff' : 'transparent',
                        color: form.layanan === opt.value ? '#000' : 'rgba(255,255,255,0.7)',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kalender & Slot Waktu */}
              <div>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                  Pilih Tanggal & Jam
                </p>
                <BookingCalendar
                  selectedDate={form.tanggal}
                  onDateSelect={(d) => setForm(p => ({ ...p, tanggal: d }))}
                  selectedSlot={form.jam}
                  onSlotSelect={(j) => setForm(p => ({ ...p, jam: j }))}
                />
              </div>

              {/* Pesan */}
              <textarea
                name="pesan"
                value={form.pesan}
                onChange={handleChange}
                rows="4"
                placeholder="Ceritakan detail proyek atau acara Anda..."
                required
                style={{ ...inputStyle, resize: 'none' }}
              />

              {/* Error message */}
              {status === 'error' && (
                <p style={{ color: '#f87171', fontSize: '0.9rem', padding: '0.8rem 1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '6px', border: '1px solid rgba(248,113,113,0.2)' }}>
                  ⚠️ {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  alignSelf: 'flex-start', padding: '1.2rem 3rem',
                  background: status === 'loading' ? 'rgba(255,255,255,0.3)' : 'transparent',
                  border: '1px solid #fff', color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  fontSize: '0.8rem', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease', marginTop: '0.5rem',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => { if (status !== 'loading') { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
              >
                {status === 'loading' ? 'Mengirim...' : 'Kirim Permintaan'}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

const inputStyle = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)',
  color: '#fff', fontSize: '1rem', padding: '1rem 0',
  fontFamily: 'var(--font-sans)', outline: 'none',
  transition: 'border-color 0.3s',
};

export default Booking;
