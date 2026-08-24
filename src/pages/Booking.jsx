import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';
import BookingCalendar from '../components/BookingCalendar';
import { LAYANAN_OPTIONS } from '../data/services';
import { STUDIO_INFO, getWhatsAppUrl } from '../data/contact';

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
      setErrorMsg('Please select a photoshoot package or studio service.');
      setStatus('error');
      return;
    }

    if (!form.tanggal || !form.jam) {
      setErrorMsg('Please select your preferred date and time slot on the calendar.');
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
        setErrorMsg(data.error || 'An error occurred. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg('Network connection failed. Please check your internet and try again.');
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
            <p style={{ color: 'var(--color-accent, #c9a96e)', fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              RESERVATION RECEIVED
            </p>
            <h2 className="font-serif" style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '1rem' }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.92rem' }}>
              Thank you, <strong>{form.nama}</strong>. Your reservation request for <strong>{form.layanan}</strong> on <strong>{form.tanggal} ({form.jam})</strong> has been received by our studio coordinator.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1.2rem', marginBottom: '2rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 600 }}>
                Next Steps:
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
                Our studio team will verify slot availability and contact you directly via WhatsApp at <strong>{form.phone}</strong> for payment details and preparation guidelines.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={getWhatsAppUrl(`Hello Faza Studio, I have submitted a reservation for ${form.layanan} on ${form.tanggal} (${form.jam}) under the name ${form.nama}.`)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.6rem',
                  background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '16px' }} />
                Instant Confirm via WhatsApp
              </a>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '0.8rem 1.6rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontSize: '0.82rem',
                }}
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: '#fff', paddingTop: '12vh', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 6%' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.8rem', fontWeight: 600 }}>
              ● FAZA STUDIO RESERVATION
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '1rem', letterSpacing: '0.04em' }}>
              SCHEDULE YOUR SESSION
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
              Select your package, choose an available date & time slot on the live calendar, and fill in your contact details below.
            </p>
          </div>

          {/* Form Card */}
          <div
            style={{
              background: '#110e0c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: 'clamp(2rem, 5vw, 3rem)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            {errorMsg && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '2rem',
                  fontSize: '0.85rem',
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {/* Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="honeypot"
                value={form.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              {/* Step 1: Package Selection */}
              <div>
                <label style={labelStyle}>1. CHOOSE SERVICE / PACKAGE *</label>
                <select
                  name="layanan"
                  value={form.layanan}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="" style={{ background: '#110e0c' }}>-- Select Studio Package --</option>
                  {LAYANAN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: '#110e0c' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Date & Slot Calendar */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                <label style={labelStyle}>2. SELECT DATE & TIME SLOT *</label>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1rem' }}>
                  Click a date on the calendar to view real-time available time slots.
                </p>
                <BookingCalendar
                  selectedDate={form.tanggal}
                  onDateSelect={(d) => setForm((prev) => ({ ...prev, tanggal: d }))}
                  selectedSlot={form.jam}
                  onSlotSelect={(s) => setForm((prev) => ({ ...prev, jam: s }))}
                />
              </div>

              {/* Step 3: Contact Info */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                <label style={labelStyle}>3. CLIENT CONTACT DETAILS *</label>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginTop: '1rem' }}>
                  <div>
                    <span style={subLabelStyle}>Full Name *</span>
                    <input
                      type="text"
                      name="nama"
                      value={form.nama}
                      onChange={handleChange}
                      placeholder="e.g. Dimas Prasetyo"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <span style={subLabelStyle}>WhatsApp / Phone Number *</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. 081234567890"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.2rem' }}>
                  <span style={subLabelStyle}>Email Address (Optional)</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. yourname@gmail.com"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginTop: '1.2rem' }}>
                  <span style={subLabelStyle}>Concept Notes / Special Requests (Optional)</span>
                  <textarea
                    name="pesan"
                    value={form.pesan}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell us about your shoot concept, team size, lighting preferences, etc."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: status === 'loading' ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {status === 'loading' ? 'Processing Reservation...' : 'Submit Schedule Booking →'}
                </button>
              </div>

              {/* Quick WhatsApp Alternative */}
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                  Prefer direct assistance?{' '}
                </span>
                <a
                  href={getWhatsAppUrl('Hello Faza Studio, I would like to inquire about booking a studio session directly.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-accent)', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 600 }}
                >
                  Chat with our coordinator on WhatsApp →
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--color-accent)',
  marginBottom: '0.4rem',
};

const subLabelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '0.4rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.88rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default Booking;
