import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES } from '../data/portfolio';
import { getWhatsAppUrl } from '../data/contact';
import { supabase } from '../lib/supabase';
import '../index.css';

// Skeleton placeholder untuk loading state
const GallerySkeleton = () => (
  <div className="masonry-grid" style={{ maxWidth: '1440px', margin: '0 auto' }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        style={{
          marginBottom: '1.8rem',
          breakInside: 'avoid',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '4/5' : '1/1',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    ))}
  </div>
);

const Karya = () => {
  const [filter, setFilter]           = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories]   = useState(PORTFOLIO_CATEGORIES);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Fetch dari Supabase database langsung via Supabase client
  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('galeri')
        .select('id, url_foto, caption, kategori, urutan')
        .order('urutan', { ascending: true })
        .order('created_at', { ascending: false });

      if (!dbError && data && data.length > 0) {
        setGalleryItems(
          data.map((g) => ({
            id: g.id,
            url_foto: g.url_foto,
            title: g.caption || '',
            category: g.kategori || 'Studio & Space',
          }))
        );

        const uniqueCats = ['All', ...new Set(data.map((d) => d.kategori).filter(Boolean))];
        setCategories(uniqueCats.length > 1 ? uniqueCats : PORTFOLIO_CATEGORIES);
      } else {
        // Fallback to static portfolio if DB empty
        setGalleryItems(
          PORTFOLIO_ITEMS.map((item) => ({
            id: item.id,
            url_foto: item.desktopSrc,
            title: item.title,
            category: item.category,
          }))
        );
      }
    } catch (err) {
      console.warn('[Karya] Supabase load note:', err);
      setGalleryItems(
        PORTFOLIO_ITEMS.map((item) => ({
          id: item.id,
          url_foto: item.desktopSrc,
          title: item.title,
          category: item.category,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();

    const handleUpdate = () => loadGallery();
    window.addEventListener('faza_gallery_updated', handleUpdate);
    return () => window.removeEventListener('faza_gallery_updated', handleUpdate);
  }, []);

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
    filter === 'All' || filter === 'Semua'
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  return (
    <PageTransition>
      <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingTop: '12vh', transition: 'background-color 0.4s ease, color 0.4s ease' }}>

        {/* Header Section */}
        <section style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 clamp(1.25rem, 6%, 7rem)' }}>
          <p style={{ fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.8rem', fontWeight: 600 }}>
            ● CURATED WORKS & PORTFOLIO
          </p>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', marginBottom: '1rem', letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            PORTFOLIO
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto 2.2rem', lineHeight: 1.7 }}>
            A curated showcase of commercial campaigns, fashion lookbooks, executive portraits, and creative space ambiance at Faza Studio East Jakarta.
          </p>

          {/* Filter Buttons — dari database, bukan hardcode */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                style={{
                  background: filter === cat ? 'var(--color-accent)' : 'var(--color-bg-card)',
                  border: filter === cat ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                  color: filter === cat ? '#ffffff' : 'var(--color-text)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '0.55rem 1.3rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: 'var(--color-card-shadow)',
                  transition: 'all 0.3s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Masonry Gallery Section */}
        <section id="portfolio-grid" style={{ padding: '0 clamp(1.25rem, 6%, 7rem) 7rem' }}>

          {/* Loading skeleton */}
          {loading && <GallerySkeleton />}

          {/* Error state */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-secondary)' }}>
              <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>{error}</p>
              <button
                onClick={() => loadGallery()}
                style={{
                  padding: '0.7rem 1.8rem',
                  borderRadius: '30px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-card)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Gallery grid */}
          {!loading && !error && (
            <motion.div layout className="masonry-grid" style={{ maxWidth: '1440px', margin: '0 auto' }}>
              <AnimatePresence>
                {filteredData.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35 }}
                    key={item.id}
                    className="gallery-item"
                    onClick={() => setSelectedImg(item)}
                    style={{
                      position: 'relative',
                      marginBottom: '1.8rem',
                      breakInside: 'avoid',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      boxShadow: 'var(--color-card-shadow)',
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {/*
                      Hanya baca item.url_foto — tidak hardcode nama kolom provider.
                      Kalau nanti pindah storage, cukup ganti nilai URL di database.
                    */}
                    <img
                      src={item.url_foto}
                      alt={item.title || item.category}
                      loading="lazy"
                      decoding="async"
                      className="faza-graded-img"
                      style={{ width: '100%', display: 'block' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        padding: '2.5rem 1.4rem 1.2rem',
                        background: 'linear-gradient(to top, rgba(14,12,10,0.92) 0%, transparent 100%)',
                      }}
                    >
                      {item.title && (
                        <h3 className="font-serif" style={{ fontSize: '1.15rem', marginBottom: '0.2rem', color: '#ffffff' }}>
                          {item.title}
                        </h3>
                      )}
                      <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-accent)', fontWeight: 600, margin: 0 }}>
                        {item.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty state */}
              {filteredData.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0', gridColumn: '1 / -1', color: 'var(--color-text-secondary)' }}>
                  <p style={{ fontSize: '0.95rem' }}>Belum ada foto di kategori ini.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Bottom CTA */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '1.4rem' }}>
              Interested in producing bespoke visual imagery for your brand or portrait session?
            </p>
            <a
              href={getWhatsAppUrl('Hello Faza Studio, I saw your portfolio and would like to discuss a photoshoot production.')}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 2rem',
                background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '50px',
                boxShadow: '0 6px 22px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
              }}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '17px', color: '#fff' }} />
              Consult Concept on WhatsApp
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
                top: 0, left: 0,
                width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.92)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImg.url_foto}
                alt={selectedImg.title || selectedImg.category}
                style={{
                  maxHeight: '85vh',
                  maxWidth: '90vw',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  background: 'rgba(18, 14, 12, 0.8)',
                  padding: '0.8rem 2rem',
                  borderRadius: '40px',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {selectedImg.title && (
                  <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>{selectedImg.title}</h4>
                )}
                <p style={{ color: 'var(--color-accent)', margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {selectedImg.category}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Karya;
