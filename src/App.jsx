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
import Loader from './components/Loader';
import IntroScreen from './components/IntroScreen';
import CustomCursor from './components/CustomCursor';
import './index.css';

// A wrapper component that allows useLocation
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/tentangkami" element={<TentangKami />} />
      </Routes>
    </AnimatePresence>
  );
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
              <li><Link to="/tentangkami" className="nav-link">Tentang Kami</Link></li>
            </ul>
          </header>

          <main>
            <AnimatedRoutes />
          </main>
        </Router>
      )}
    </>
  );
}

export default App;
