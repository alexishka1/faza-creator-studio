import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faCheck, faTag } from '@fortawesome/free-solid-svg-icons';
import PageTransition from '../components/PageTransition';
import { ALL_SERVICES } from '../data/services';
import { getWhatsAppUrl } from '../data/contact';
import { supabase } from '../lib/supabase';
import '../index.css';

// Bank foto alternatif buat thumbnail kedua
const ALT_IMAGES = [
  '/images/optimized/DSCF9527-1600.webp',
  '/images/optimized/DSCF9518-1600.webp',
  '/images/optimized/DSCF9520-1600.webp',
  '/images/optimized/DSCF9524-1600.webp',
  '/images/optimized/DSCF9515-1600.webp',
  '/images/optimized/DSCF9516-1600.webp',
  '/images/optimized/DSCF9528-800.webp',
];

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Instant synchronous cache match from static data (0ms wait time!)
  const initialService = ALL_SERVICES.find((s) => s.id === id) || null;
  const [service, setService] = useState(initialService);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(!initialService);

  useEffect(() => {
    setActiveImg(0);
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    const load = async () => {
      // If we don't have static cache, indicate loading
      if (!initialService) {
        setLoading(true);
      }

      try {
        const { data, error } = await supabase
          .from('paket')
          .select('*')
          .eq('id', id)
          .eq('status', 'aktif')
          .maybeSingle();

        if (!error && data) {
          setService({
            id:         data.id,
            title:      data.nama,
            subtitle:   data.subtitle || '',
            price:      data.harga,
            tag:        data.tag || '',
            desc:       data.deskripsi || '',
            features:   data.fitur || [],
            desktopImg: data.url_foto || null,
            mobileImg:  data.url_foto || null,
          });
          setLoading(false);
          return;
        }
      } catch (_e) { /* fallback to static */ }

      const found = ALL_SERVICES.find((s) => s.id === id);
      if (found) {
        setService(found);
        setLoading(false);
      } else if (!initialService) {
        navigate('/layanan', { replace: true });
      }
    };

    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: 'clamp(2rem, 5vh, 4rem) clamp(1.25rem, 6%, 7rem)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4', borderRadius: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingTop: '1rem' }}>
            <div className="skeleton" style={{ width: '30%', height: '20px', borderRadius: '6px' }} />
            <div className="skeleton" style={{ width: '70%', height: '42px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '50%', height: '55px', borderRadius: '10px' }} />
            <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '10px' }} />
          </div>
        </div>
      </div>
    );
  }
  if (!service) return null;

  // Build image array: primary + satu alternatif yang beda
  const primaryImg = service.desktopImg || service.mobileImg;
  const images = [primaryImg];
  const alt = ALT_IMAGES.find((img) => img !== primaryImg);
  if (alt) images.push(alt);

  const waUrl = getWhatsAppUrl(
    `Hello Faza Studio! I'm interested in the *${service.title}${service.subtitle ? ' ' + service.subtitle : ''}* package (${service.price}). Could you please give me more info and check availability?`
  );

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'background-color 0.4s ease' }}>

        {/* Breadcrumb */}
        <div style={{ padding: '1.2rem clamp(1.25rem, 6%, 7rem)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/layanan" style={{ color: 'inherit', textDecoration: 'none' }}>Rates &amp; Services</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{service.title}{service.subtitle ? ' ' + service.subtitle : ''}</span>
        </div>

        {/* Main Grid */}
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: 'clamp(2.5rem, 6vh, 5rem) clamp(1.25rem, 6%, 5rem)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'start' }} className="pkg-grid">

          {/* ── LEFT: Photo Gallery ── */}
          <div>
            {/* Main photo */}
            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', background: 'var(--color-bg-card)', boxShadow: 'var(--color-card-shadow)', position: 'relative', marginBottom: '0.9rem' }}>
              <img
                src={images[activeImg]}
                alt={`${service.title} ${service.subtitle}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                className="faza-graded-img"
              />
              {/* Tag */}
              <span style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.28rem 0.8rem', background: 'var(--color-accent)', borderRadius: '20px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>
                {service.tag}
              </span>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{ flex: '1', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', border: activeImg === i ? '2.5px solid var(--color-accent)' : '2px solid var(--color-border)', background: 'var(--color-bg-card)', cursor: 'pointer', padding: 0, transition: 'border-color 0.25s ease' }}
                >
                  <img src={img} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Detail Info ── */}
          <div style={{ position: 'sticky', top: '5.5rem' }}>
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, padding: '0 0 1.4rem', transition: 'color 0.3s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '10px' }} />
              Back to Services
            </button>

            {/* Tag label */}
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '0.4rem' }}>
              FAZA STUDIO — {service.tag}
            </p>

            {/* Name - Full Bold Single Style */}
            <h1 className="font-serif" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 700, lineHeight: 1.15, margin: '0 0 1.5rem', color: 'var(--color-text)' }}>
              {service.title}{service.subtitle ? ` ${service.subtitle}` : ''}
            </h1>

            {/* Price Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.9rem 1.1rem', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-border-hover)', borderRadius: '10px', marginBottom: '1.6rem' }}>
              <FontAwesomeIcon icon={faTag} style={{ color: 'var(--color-accent)', fontSize: '0.8rem' }} />
              <div>
                <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.1rem' }}>Price</span>
                <span style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-serif)' }}>
                  {service.price}
                </span>
              </div>
            </div>

            {/* Description */}
            {service.desc && (
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.78, marginBottom: '1.8rem' }}>
                {service.desc}
              </p>
            )}

            {/* What's Included */}
            {service.features?.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 700, marginBottom: '0.8rem' }}>
                  Apa yang termasuk di dalamnya
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {service.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', fontSize: '0.83rem', color: 'var(--color-text)', padding: '0.55rem 0.85rem', background: 'var(--color-bg-card)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <FontAwesomeIcon icon={faCheck} style={{ color: 'var(--color-accent)', fontSize: '0.72rem', marginTop: '2px', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

            {/* WhatsApp CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', width: '100%', padding: '0.95rem 1.5rem', background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))', color: '#fff', textDecoration: 'none', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.04em', boxShadow: '0 6px 25px rgba(36, 215, 87, 0.4)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 35px rgba(36, 215, 87, 0.55)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(36, 215, 87, 0.4)'; }}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '20px' }} />
              Book via WhatsApp
            </a>

            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.65rem', letterSpacing: '0.04em' }}>
              Mon–Sun · 09:00 – 21:00 WIB · Fast response guaranteed
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pkg-grid { grid-template-columns: 1fr !important; }
          .pkg-grid > div:last-child { position: static !important; }
        }
      `}</style>
    </PageTransition>
  );
};

export default PackageDetail;
