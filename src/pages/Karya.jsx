import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';

const portfolioData = [
  { id: 1, desktopSrc: '/images/optimized/DSCF9516-1600.webp', mobileSrc: '/images/optimized/DSCF9516-800.webp', category: 'Ruang & Studio', title: 'Studio Ambiance & Cyclorama Wall' },
  { id: 2, desktopSrc: '/images/optimized/DSCF9527-1600.webp', mobileSrc: '/images/optimized/DSCF9527-800.webp', category: 'Portrait & Personal', title: 'Warm Tone Portrait Session' },
  { id: 3, desktopSrc: '/images/optimized/DSCF9518-1600.webp', mobileSrc: '/images/optimized/DSCF9518-800.webp', category: 'Editorial & Fashion', title: 'Editorial & Fashion Story' },
  { id: 4, desktopSrc: '/images/optimized/DSCF9520-1600.webp', mobileSrc: '/images/optimized/DSCF9520-800.webp', category: 'Portrait & Personal', title: 'LinkedIn & Executive Headshot' },
  { id: 5, desktopSrc: '/images/optimized/DSCF9524-1600.webp', mobileSrc: '/images/optimized/DSCF9524-800.webp', category: 'Editorial & Fashion', title: 'Lookbook & Styling Production' },
  { id: 6, desktopSrc: '/images/optimized/DSCF9515-1600.webp', mobileSrc: '/images/optimized/DSCF9515-800.webp', category: 'Commercial & Product', title: 'Commercial Studio Lighting' },
  { id: 7, desktopSrc: '/images/optimized/DSCF9528-1600.webp', mobileSrc: '/images/optimized/DSCF9528-800.webp', category: 'Ruang & Studio', title: 'Lounge Area & Makeup Station' },
  { id: 8, desktopSrc: '/images/optimized/DSCF9530-1600.webp', mobileSrc: '/images/optimized/DSCF9530-800.webp', category: 'Commercial & Product', title: 'Product Showcase & E-Commerce' },
];

const categories = ['Semua', 'Portrait & Personal', 'Commercial & Product', 'Editorial & Fashion', 'Ruang & Studio'];

const Karya = () => {
  const [filter, setFilter] = useState('Semua');
  const [selectedImg, setSelectedImg] = useState(null);

  const handleFilterChange = (cat) => {
    setFilter(cat);
    const gridEl = document.getElementById('portfolio-grid');
    if (gridEl) {
      const rect = gridEl.getBoundingClientRect();
      if (rect.top < 100) {
        if (window.lenis) {
          window.lenis.scrollTo(gridEl, { offset: -140, duration: 0.8 });
        } else {
          gridEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const filteredData =
    filter === 'Semua' ? portfolioData : portfolioData.filter((item) => item.category === filter);

  return (
    <PageTransition>
      <div style={{ background: 'var(--color-bg)', color: '#fff', minHeight: '100vh', paddingTop: '14vh' }}>
        {/* Header Section */}
        <section style={{ textAlign: 'center', marginBottom: '3.5rem', padding: '0 6%' }}>
          <p style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1rem', fontWeight: 600 }}>
            ● Portfolio & Karya Pilihan
          </p>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)', marginBottom: '1.5rem' }}>
            PORTFOLIO
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Koleksi hasil sesi pemotretan personal, kampanye komersial, editorial, dan suasana ruang kreatif Faza Studio Jakarta Timur.
          </p>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                style={{
                  background: filter === cat ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  border: filter === cat ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.15)',
                  color: filter === cat ? '#000' : 'rgba(255,255,255,0.85)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Masonry Gallery Section */}
        <section id="portfolio-grid" style={{ padding: '0 6% 8rem 6%' }}>
          <motion.div layout className="masonry-grid" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <AnimatePresence>
              {filteredData.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className="gallery-item"
                  onClick={() => setSelectedImg(item)}
                  style={{
                    position: 'relative',
                    marginBottom: '2rem',
                    breakInside: 'avoid',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                    background: '#14110f',
                  }}
                >
                  <img
                    src={item.desktopSrc}
                    srcSet={`${item.mobileSrc} 800w, ${item.desktopSrc} 1600w`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={item.title}
                    loading="lazy"
                    className="faza-graded-img"
                    style={{
                      width: '100%',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '2.5rem 1.5rem 1.2rem',
                      background: 'linear-gradient(to top, rgba(14,12,10,0.95) 0%, transparent 100%)',
                    }}
                  >
                    <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.2rem', color: '#fff' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-accent)', fontWeight: 600, margin: 0 }}>
                      {item.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Direct CTA */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '1.5rem' }}>
              Tertarik memiliki karya visual seperti ini untuk kebutuhan Anda?
            </p>
            <a
              href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20tertarik%20dengan%20karya%20portfolio%20dan%20ingin%20tanya%20paket%20foto."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.95rem 2.2rem',
                background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '50px',
                boxShadow: '0 6px 22px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
              }}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#fff' }} />
              Konsultasi Konsep via WhatsApp
            </a>
          </div>
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
                padding: '2rem',
              }}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImg.desktopSrc}
                alt={selectedImg.title}
                style={{
                  maxHeight: '85vh',
                  maxWidth: '90vw',
                  objectFit: 'contain',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                  borderRadius: '6px',
                }}
              />
              <p
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  color: 'rgba(255,255,255,0.75)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                }}
              >
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
