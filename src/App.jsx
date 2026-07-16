import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Layanan from './pages/Layanan';
import TentangKami from './pages/TentangKami';
import Loader from './components/Loader';
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
  return (
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
  );
}

export default App;
