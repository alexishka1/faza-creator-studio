import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

gsap.registerPlugin(ScrollTrigger);

import Home from './pages/Home';
import Layanan from './pages/Layanan';
import TentangKami from './pages/TentangKami';
import Karya from './pages/Karya';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import ScrollToTop from './components/ScrollToTop';
import ThemeToggle from './components/ThemeToggle';
import { STUDIO_INFO, getWhatsAppUrl } from './data/contact';
import './index.css';

// Client Layout for Public Marketing Pages
const ClientLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  // Direct Lenis smooth scroll initialization on mount
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.lenis = null;
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <WhatsAppFloating />

      {/* Header */}
      <header className="header" style={{ borderBottom: '1px solid var(--color-header-border)' }}>
        <div className="brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-brand-color, #8c6227)' }}>
            <span className="brand-text" style={{ color: 'var(--color-brand-color, #8c6227)' }}>{STUDIO_INFO.name}</span>
          </Link>
        </div>
        {/* Desktop Nav Links */}
        <ul className="nav-links desktop-nav">
          <li><Link to="/" className="nav-link" style={{ color: 'var(--color-nav-link, #8c6227)' }}>Home</Link></li>
          <li><Link to="/layanan" className="nav-link" style={{ color: 'var(--color-nav-link, #8c6227)' }}>Rates & Services</Link></li>
          <li><Link to="/karya" className="nav-link" style={{ color: 'var(--color-nav-link, #8c6227)' }}>Portfolio</Link></li>
          <li><Link to="/tentangkami" className="nav-link" style={{ color: 'var(--color-nav-link, #8c6227)' }}>About Us</Link></li>
        </ul>

        {/* Far Right Corner Controls: WhatsApp CTA + Theme Toggle */}
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href={getWhatsAppUrl('Hello Faza Studio, I would like to inquire about studio booking and rates.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-nav"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.3rem',
              background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '30px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              boxShadow: '0 4px 18px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px var(--color-wa-glow-strong, rgba(46, 230, 107, 0.65))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px var(--color-wa-glow, rgba(36, 215, 87, 0.45))';
            }}
          >
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '15px', color: '#fff' }} />
            Book via WhatsApp
          </a>

          {/* Light/Dark Mode Toggle — pojok kanan paling ujung */}
          <ThemeToggle />
        </div>

        {/* Mobile Header Actions: Theme Toggle + Hamburger (Top Right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="mobile-header-actions">
          <ThemeToggle />
          <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-color, #8c6227)" strokeWidth="2" strokeLinecap="square">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100vh',
          background: 'var(--color-bg)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto',
          padding: '4rem 0',
          opacity: isMobileMenuOpen ? 1 : 0,
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'opacity 0.4s ease, transform 0.4s ease, background-color 0.4s ease',
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
      >
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'absolute', top: '2rem', right: '2rem', cursor: 'pointer', zIndex: 10 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.6rem', alignItems: 'center' }}>
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ ...mobileLinkStyle, color: 'var(--color-text)' }}>Home</Link></li>
          <li><Link to="/layanan" onClick={() => setIsMobileMenuOpen(false)} style={{ ...mobileLinkStyle, color: 'var(--color-text)' }}>Rates & Services</Link></li>
          <li><Link to="/karya" onClick={() => setIsMobileMenuOpen(false)} style={{ ...mobileLinkStyle, color: 'var(--color-text)' }}>Portfolio</Link></li>
          <li><Link to="/tentangkami" onClick={() => setIsMobileMenuOpen(false)} style={{ ...mobileLinkStyle, color: 'var(--color-text)' }}>About Us</Link></li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <a
              href={getWhatsAppUrl('Hello Faza Studio, I would like to inquire about studio booking and rates.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '40px',
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                boxShadow: '0 6px 22px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
              }}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '20px', color: '#fff' }} />
              Book via WhatsApp
            </a>
          </li>
        </ul>
      </div>

      <main>{children}</main>

      {/* Footer */}
      {location.pathname !== '/tentangkami' && <Footer />}
    </>
  );
};

// Animated client routes
const ClientAnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/tentangkami" element={<TentangKami />} />
        <Route path="/karya" element={<Karya />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </AnimatePresence>
  );
};

const mobileLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1.4rem',
  fontFamily: 'var(--font-serif)',
  letterSpacing: '0.05em',
  display: 'block',
  transition: 'color 0.3s ease',
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 1. ISOLATED ADMIN PORTAL */}
        <Route path="/admin" element={<Admin />} />

        {/* 2. PUBLIC USER WEBSITE (Full English, Direct Access, Compact Proportions) */}
        <Route
          path="/*"
          element={
            <ClientLayout>
              <ClientAnimatedRoutes />
            </ClientLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
