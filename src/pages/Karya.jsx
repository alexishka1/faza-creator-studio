import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const portfolioData = [
  { id: 1, src: '/images/gallery/unsplash_1.jpg', category: 'Wedding', title: 'The Vow' },
  { id: 2, src: '/images/gallery/unsplash_2.jpg', category: 'Commercial', title: 'Urban Edge' },
  { id: 3, src: '/images/gallery/unsplash_3.jpg', category: 'Portrait', title: 'Soul Stare' },
  { id: 4, src: '/images/gallery/unsplash_4.jpg', category: 'Commercial', title: 'Neon Nights' },
  { id: 5, src: '/images/gallery/unsplash_5.jpg', category: 'Wedding', title: 'Eternity' },
  { id: 6, src: '/images/gallery/unsplash_6.jpg', category: 'Portrait', title: 'Shadow Play' },
  { id: 7, src: '/images/gallery/unsplash_7.jpg', category: 'Commercial', title: 'Minimalist' },
  { id: 8, src: '/images/gallery/unsplash_8.jpg', category: 'Wedding', title: 'Golden Hour' },
];

const categories = ['Semua', 'Wedding', 'Commercial', 'Portrait'];

const Karya = () => {
  const [filter, setFilter] = useState('Semua');
  const [selectedImg, setSelectedImg] = useState(null);

  const filteredData = filter === 'Semua' 
    ? portfolioData 
    : portfolioData.filter(item => item.category === filter);

  return (
    <PageTransition>
      <div style={{ background: 'var(--color-bg)', color: '#fff', minHeight: '100vh', paddingTop: '15vh' }}>
        
        {/* Header Section */}
        <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 5%' }}>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
            Selected Works
          </p>
          <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '2rem' }}>
            PORTFOLIO
          </h1>
          
          {/* Filter Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: filter === cat ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderBottom: filter === cat ? '1px solid #fff' : '1px solid transparent',
                  paddingBottom: '5px',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Masonry Gallery Section */}
        <section style={{ padding: '0 5% 10rem 5%' }}>
          <motion.div layout className="masonry-grid">
            <AnimatePresence>
              {filteredData.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  key={item.id}
                  className="gallery-item"
                  onClick={() => setSelectedImg(item)}
                  style={{
                    position: 'relative',
                    marginBottom: '2rem',
                    breakInside: 'avoid',
                    overflow: 'hidden',
                    cursor: 'none'
                  }}
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    style={{ 
                      width: '100%', 
                      display: 'block', 
                      filter: 'grayscale(100%)',
                      transition: 'all 0.5s ease'
                    }} 
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'grayscale(100%)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '2rem 1.5rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                      pointerEvents: 'none',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>{item.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.95)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
              }}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImg.src}
                alt={selectedImg.title}
                style={{
                  maxHeight: '90vh',
                  maxWidth: '90vw',
                  objectFit: 'contain',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
              />
              <p style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem' }}>
                Klik di mana saja untuk menutup
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default Karya;
