import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import Home from './pages/Home';
import Layanan from './pages/Layanan';
import TentangKami from './pages/TentangKami';
import Karya from './pages/Karya';
import Booking from './pages/Booking';
import Loader from './components/Loader';
import IntroScreen from './components/IntroScreen';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import './index.css';

// A wrapper component that allows useLocation
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
      </Routes>
    </AnimatePresence>
  );
};

const FooterWrapper = () => {
  const location = useLocation();
  // Hide footer on Home (/) and Tentang Kami (/tentangkami)
  if (location.pathname === '/' || location.pathname === '/tentangkami') {
    return null;
  }
  return <Footer />;
};

function App() {
  const [hasStarted, setHasStarted] = useState(false);

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

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [hasStarted]);

  return (
    <>
      <CustomCursor />
      {!hasStarted && <IntroScreen onStart={() => setHasStarted(true)} />}
      
      {hasStarted && (
        <Router>
          <Loader />
          {/* GLOBAL HEADER LOGO & NAV */}
          <header className="header">
            <div className="brand">
              <span className="brand-text">FAZA STUDIO</span>
            </div>
            <ul className="nav-links">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/layanan" className="nav-link">Layanan</Link></li>
              <li><Link to="/karya" className="nav-link">Karya</Link></li>
              <li><Link to="/tentangkami" className="nav-link">Tentang Kami</Link></li>
              <li>
                <Link to="/booking" style={{
                  border: '1px solid #fff', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '30px', 
                  textDecoration: 'none', 
                  color: '#fff',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                >
                  Booking
                </Link>
              </li>
            </ul>
          </header>

          <main>
            <AnimatedRoutes />
          </main>
          <FooterWrapper />
        </Router>
      )}
    </>
  );
}

export default App;

