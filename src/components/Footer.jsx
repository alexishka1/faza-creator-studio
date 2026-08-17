import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: '#0a0807',
        color: '#fff',
        paddingTop: '6rem',
      }}
    >
      {/* Faded Authentic Background Image (Spec: Opacity 18%, Graded) */}
      <div
        className="faza-faded-bg"
        style={{
          backgroundImage: 'url("/images/optimized/DSCF9515-1600.webp")',
          opacity: 0.18,
        }}
      />
      {/* Dark Scrim Overlay */}
      <div className="faza-scrim" />

      {/* Top Content: Grid Information */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 6%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3.5rem',
          marginBottom: '4rem',
        }}
      >
        {/* Column 1: Brand & Direct CTA */}
        <div>
          <p style={{ fontSize: '0.78rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: 600 }}>
            ● Studio Aktif & Menerima Booking
          </p>
          <h3 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '1.2rem', letterSpacing: '0.04em', lineHeight: 1.2 }}>
            Siap Mewujudkan <br />
            Karya Visual Anda?
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '380px' }}>
            Konsultasikan ide sesi foto, sewa studio per jam, atau kebutuhan komersial brand Anda langsung dengan tim Faza Studio.
          </p>
          <a
            href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20tertarik%20untuk%20booking%20atau%20tanya%20jadwal%20studio."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.9rem 2rem',
              background: '#25D366',
              color: '#fff',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '50px',
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.35)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#fff' }} />
            Chat WhatsApp
          </a>
        </div>

        {/* Column 2: Kontak Utama & Jam Operasional */}
        <div>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '1.5rem', fontWeight: 600 }}>
            Kontak & Jam Buka
          </h4>

          <div style={{ marginBottom: '1.8rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.4rem' }}>
              WhatsApp Hotline
            </p>
            <a
              href="https://wa.me/6285933585829"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#25D366', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              +62 859-3358-5829 ↗
            </a>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.4rem' }}>
              Instagram Resmi
            </p>
            <a
              href="https://instagram.com/fazastudio"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              @fazastudio ↗
            </a>
          </div>

          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.4rem' }}>
              Jam Operasional
            </p>
            <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              Senin – Minggu: 09.00 – 21.00 WIB <br />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>(Berdasarkan Reservasi Jadwal)</span>
            </p>
          </div>
        </div>

        {/* Column 3: Lokasi & Google Maps */}
        <div>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '1.5rem', fontWeight: 600 }}>
            Lokasi Studio
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>Faza Studio Jakarta</strong>
            Jl. Dukuh V No. 79, RT.05/RW.02, Dukuh, Kec. Kramat Jati, Jakarta Timur, DKI Jakarta 13550
          </p>

          {/* Maps Embed Card */}
          <div
            style={{
              background: '#14110f',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📍</span>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Akses Mudah & Parkir Luas</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem' }}>Area Ciracas & Kramat Jati</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Jl.+Dukuh+V+No+79+Jakarta+Timur"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                textAlign: 'center',
                padding: '0.6rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(201,169,110,0.3)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#fff';
              }}
            >
              Buka di Google Maps ↗
            </a>
          </div>
        </div>

        {/* Column 4: Navigasi Cepat */}
        <div>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '1.5rem', fontWeight: 600 }}>
            Navigasi
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Home</Link></li>
            <li><Link to="/layanan" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Sewa Studio & Daftar Harga</Link></li>
            <li><Link to="/karya" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Portfolio Karya</Link></li>
            <li><Link to="/tentangkami" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Tentang Faza Studio</Link></li>
            <li><Link to="/booking" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Form Booking Online ↗</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Content: Massive Logo & Copyright */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: 'auto' }}>
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(4.5rem, 14vw, 14rem)',
            lineHeight: 0.8,
            margin: 0,
            color: 'rgba(201, 169, 110, 0.05)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          FAZA STUDIO
        </h1>
        <div
          style={{
            padding: '1.5rem 6%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
          }}
        >
          <span>© {new Date().getFullYear()} FAZA STUDIO — Creative Space & Photo Studio Jakarta Timur.</span>
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Crafted with Precision & Aesthetics</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
