import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';
import BookingCalendar from '../components/BookingCalendar';
import { LAYANAN_OPTIONS } from '../data/services';
import { STUDIO_INFO, getWhatsAppUrl } from '../data/contact';
import '../index.css';

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
            style={{ maxWidth: '600px', width: '100%', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-hover)', borderRadius: '12px', padding: '3rem 2.5rem', textAlign: 'center', boxShadow: 'var(--color-card-shadow)' }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <p style={{ color: 'var(--color-accent)', fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              RESERVATION RECEIVED
            </p>
            <h2 className="font-serif" style={{ color: 'var(--color-text)', fontSize: '2.2rem', marginBottom: '1rem' }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.92rem' }}>
              Thank you, <strong>{form.nama}</strong>. Your reservation request for <strong>{form.layanan}</strong> on <strong>{form.tanggal} ({form.jam})</strong> has been received by our studio coordinator.
            </p>

            <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '8px', padding: '1.2rem', marginBottom: '2rem', textAlign: 'left', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 600 }}>
                Next Steps:
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
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
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
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

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
    marginBottom: '0.6rem',
    fontWeight: 600,
  };

  const inputStyle = {
    width: '100%',
    padding: '0.9rem 1.2rem',
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    color: 'var(--color-text)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', paddingTop: '12vh', paddingBottom: '6rem', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 6%' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.8rem', fontWeight: 600 }}>
              ● FAZA STUDIO RESERVATION
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '1rem', letterSpacing: '0.04em', color: 'var(--color-text)' }}>
              SCHEDULE YOUR SESSION
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
              Select your package, choose an available date & time slot on the live calendar, and fill in your contact details below.
            </p>
          </div>

          {/* Form Card */}
          <div
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: 'clamp(2rem, 5vw, 3rem)',
              boxShadow: 'var(--color-card-shadow)',
            }}
          >
            {errorMsg && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#dc2626',
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
                  <option value="" style={{ background: 'var(--color-bg-card)' }}>-- Select Studio Package --</option>
                  {LAYANAN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: 'var(--color-bg-card)' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Date & Slot Calendar */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <label style={labelStyle}>2. SELECT DATE & TIME SLOT *</label>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem' }}>
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
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <label style={labelStyle}>3. YOUR CONTACT INFORMATION</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Full Name *</span>
                    <input
                      type="text"
                      name="nama"
                      value={form.nama}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Email Address *</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. sarah@domain.com"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>WhatsApp / Phone *</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. 08123456789"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Notes / Concept */}
              <div>
                <label style={labelStyle}>4. SPECIAL REQUESTS / CONCEPTS (OPTIONAL)</label>
                <textarea
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  placeholder="Describe your creative concept, backdrop preferences, or number of attendees..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    background: 'var(--color-accent)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '35px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    boxShadow: 'var(--color-card-shadow)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {status === 'loading' ? 'Processing Reservation...' : 'Confirm & Reserve Studio Slot →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Booking;
