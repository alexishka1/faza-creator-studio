import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { STUDIO_INFO, getWhatsAppUrl } from '../data/contact';
import '../index.css';

const Footer = () => {
  return (
    <footer
      style={{
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text)',
        paddingTop: '5rem',
        transition: 'background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Faded Authentic Background Image */}
      <div
        className="faza-faded-bg"
        style={{
          backgroundImage: 'url("/images/optimized/DSCF9515-1600.webp")',
        }}
      />
      {/* Scrim Overlay */}
      <div className="faza-scrim" />

      {/* Top Content: Grid Information */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 6%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}
      >
        {/* Column 1: Brand & Direct CTA */}
        <div>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 600 }}>
            ● Studio Active & Accepting Bookings
          </p>
          <h3 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', marginBottom: '1rem', letterSpacing: '0.04em', lineHeight: 1.2, color: 'var(--color-text)' }}>
            Ready to Bring Your <br />
            Visuals to Life?
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.88rem', marginBottom: '1.8rem', maxWidth: '360px' }}>
            Consult your photoshoot concepts, hourly studio rental, or commercial brand production directly with the {STUDIO_INFO.name} team.
          </p>
          <a
            href={getWhatsAppUrl('Hello Faza Studio, I would like to inquire about booking and studio schedule.')}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.8rem 1.8rem',
              background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '50px',
              boxShadow: '0 6px 22px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '16px', color: '#fff' }} />
            Chat on WhatsApp
          </a>
        </div>

        {/* Column 2: Main Contact & Hours */}
        <div>
          <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '1.2rem', fontWeight: 600 }}>
            Contact & Operating Hours
          </h4>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>
              WhatsApp Direct Hotline
            </p>
            <a
              href={`https://wa.me/${STUDIO_INFO.phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-wa-dark, #149c3b)', textDecoration: 'none', fontSize: '0.98rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {STUDIO_INFO.phone} ↗
            </a>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>
              Official Instagram
            </p>
            <a
              href={STUDIO_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.98rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {STUDIO_INFO.instagramHandle} ↗
            </a>
          </div>

          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>
              Opening Hours
            </p>
            <p style={{ color: 'var(--color-text)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              {STUDIO_INFO.operatingHours} <br />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem' }}>({STUDIO_INFO.operatingHoursNote})</span>
            </p>
          </div>
        </div>

        {/* Column 3: Location & Google Maps */}
        <div>
          <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '1.2rem', fontWeight: 600 }}>
            Studio Location
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
            <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '0.2rem' }}>{STUDIO_INFO.name}</strong>
            {STUDIO_INFO.address}
          </p>

          {/* Maps Embed Card */}
          <div
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              boxShadow: 'var(--color-card-shadow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📍</span>
              <div>
                <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.82rem', fontWeight: 600 }}>Easy Access & Parking Space</p>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.72rem' }}>Grand Dukuh Indah, Kramat Jati, Jakarta Timur</p>
              </div>
            </div>
            <a
              href={STUDIO_INFO.mapsDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                textAlign: 'center',
                padding: '0.55rem 0.9rem',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-hover)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-secondary)';
                e.currentTarget.style.color = 'var(--color-text)';
              }}
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>

        {/* Column 4: Quick Navigation */}
        <div>
          <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '1.2rem', fontWeight: 600 }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li><Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Home</Link></li>
            <li><Link to="/layanan" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Rates & Services</Link></li>
            <li><Link to="/karya" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Portfolio & Works</Link></li>
            <li><Link to="/tentangkami" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>About Faza Studio</Link></li>
            <li><Link to="/booking" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Online Calendar Booking ↗</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Content: Massive Logo & Copyright */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: 'auto' }}>
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(3.8rem, 12vw, 12rem)',
            lineHeight: 0.8,
            margin: 0,
            color: 'var(--color-accent)',
            opacity: 0.08,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          FAZA STUDIO
        </h1>
        <div
          style={{
            padding: '1.2rem 6%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.8rem',
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
          }}
        >
          <span>© {new Date().getFullYear()} FAZA STUDIO — Creative Space & Photo Studio East Jakarta.</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>Crafted with Precision & Aesthetics</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
