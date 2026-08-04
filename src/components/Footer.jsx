import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      position: 'relative',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      backgroundColor: '#030303',
      color: '#fff',
      paddingTop: '8rem',
    }}>
      {/* Background Image with Dark Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/images/gallery/unsplash_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(100%) brightness(0.2)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #050505 0%, transparent 50%, #030303 100%)',
        zIndex: 1
      }} />

      {/* Top Content: Links & Info */}
      <div style={{ position: 'relative', zIndex: 2, padding: '0 5%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4rem' }}>
        
        {/* Left: Brand & Address */}
        <div style={{ maxWidth: '400px' }}>
          <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Mari Berkolaborasi.</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '2rem' }}>
            Kami selalu terbuka untuk mendiskusikan proyek kreatif, pemotretan komersial, atau mendokumentasikan momen paling berharga dalam hidup Anda.
          </p>
          <a href="mailto:hello@fazastudio.com" style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            border: '1px solid #fff',
            color: '#fff',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.8rem'
          }}>Hubungi Kami</a>
        </div>

        {/* Right: Quick Links & Socials */}
        <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Menu</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><Link to="/" style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.3s' }}>Home</Link></li>
              <li><Link to="/layanan" style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.3s' }}>Layanan</Link></li>
              <li><Link to="/tentangkami" style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.3s' }}>Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Sosial Media</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.3s' }}>Instagram</a></li>
              <li><a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.3s' }}>Behance</a></li>
              <li><a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.3s' }}>WhatsApp</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Content: Massive Logo */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: 'auto' }}>
        <h1 className="font-serif" style={{
          fontSize: 'clamp(5rem, 15vw, 15rem)',
          lineHeight: 0.8,
          margin: 0,
          color: 'rgba(255,255,255,0.05)',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>
          FAZA STUDIO
        </h1>
        <div style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span>© 2026 FAZA STUDIO. All Rights Reserved.</span>
          <span>Designed with Passion</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
