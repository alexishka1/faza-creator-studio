import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import Loader from './components/Loader';
import IntroScreen from './components/IntroScreen';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

// Animated route transitions
const AnimatedRoutes = () => {
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
};

// Header Wrapper to hide on /admin
const HeaderWrapper = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  if (location.pathname === '/admin') return null;

  return (
    <header className="header">
      <div className="brand">
        <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
          <span className="brand-text">FAZA STUDIO</span>
        </Link>
      </div>
      <ul className="nav-links desktop-nav">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/layanan" className="nav-link">Sewa Studio / Harga</Link></li>
        <li><Link to="/karya" className="nav-link">Karya</Link></li>
        <li><Link to="/tentangkami" className="nav-link">Tentang Kami</Link></li>
        <li>
          <a
            href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20tertarik%20untuk%20booking%20atau%20tanya%20jadwal%20studio."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-nav"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.4rem',
              background: '#25D366',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '30px',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.35)';
            }}
          >
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '16px', color: '#fff' }} />
            Booking via WhatsApp
          </a>
        </li>
      </ul>

      {/* Mobile Hamburger Icon */}
      <div className="mobile-menu-btn" onClick={onOpenMobileMenu}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="square">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
    </header>
  );
};

// Footer Wrapper to hide on specific pages
const FooterWrapper = () => {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/tentangkami' || location.pathname === '/admin') {
    return null;
  }
  return <Footer />;
};

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Only init lenis after intro is done
    if (!hasStarted) return;

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
  }, [hasStarted]);

  return (
    <>
      <CustomCursor />
      {!hasStarted && <IntroScreen onStart={() => setHasStarted(true)} />}
      
      {hasStarted && (
        <Router>
          <ScrollToTop />
          <Loader />
          <WhatsAppFloating />
          
          <HeaderWrapper onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          {/* Full Screen Mobile Menu Overlay */}
          <div 
            style={{
              position: 'fixed',
              top: 0, left: 0, width: '100%', height: '100vh',
              background: '#0a0807',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              overflowY: 'auto',
              padding: '4rem 0',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
            }}
          >
            <div 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', cursor: 'pointer', zIndex: 10 }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="square">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Home</Link></li>
              <li><Link to="/layanan" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Sewa Studio / Harga</Link></li>
              <li><Link to="/karya" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Karya</Link></li>
              <li><Link to="/tentangkami" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Tentang Kami</Link></li>
              <li>
                <a
                  href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20tertarik%20untuk%20booking%20atau%20tanya%20jadwal%20studio."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: '#25D366',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '0.85rem 2.2rem',
                    borderRadius: '40px',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                  }}
                >
                  <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '22px', color: '#fff' }} />
                  Booking via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <main>
            <AnimatedRoutes />
          </main>
          <FooterWrapper />
        </Router>
      )}
    </>
  );
}

const mobileLinkStyle = {
  textDecoration: 'none',
  color: '#fff',
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
  textTransform: 'uppercase',
  display: 'inline-block'
};

export default App;
