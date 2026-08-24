import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { B2C_SERVICES, B2B_SERVICES } from '../data/services';
import { getWhatsAppUrl } from '../data/contact';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_IMAGES = [
  '/images/optimized/DSCF9516-800.webp',
  '/images/optimized/DSCF9527-800.webp',
  '/images/optimized/DSCF9518-800.webp',
  '/images/optimized/DSCF9520-800.webp',
  '/images/optimized/DSCF9524-800.webp',
  '/images/optimized/DSCF9515-800.webp',
  '/images/optimized/DSCF9516-800.webp',
  '/images/optimized/DSCF9527-800.webp',
];

const Layanan = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const marqueeRef = useRef(null);
  const servicesRef = useRef([]);
  const [activeTab, setActiveTab] = useState('all');
  const [b2cServices, setB2cServices] = useState(B2C_SERVICES);
  const [b2bServices, setB2bServices] = useState(B2B_SERVICES);

  // Fetch latest packages from Database (with static instant fallback)
  useEffect(() => {
    fetch('/api/packages')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.b2c && data.b2b) {
          setB2cServices(data.b2c);
          setB2bServices(data.b2b);
        }
      })
      .catch((err) => console.warn('Fetch packages error:', err));
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: headerRef.current,
        pinSpacing: false,
      });

      // Right-moving marquee (Tahap 2B)
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: 50,
          ease: 'none',
          duration: 35,
          repeat: -1,
        });
      }

      servicesRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [activeTab]);

  const renderServiceCard = (service, i) => {
    const isEven = i % 2 === 0;
    return (
      <div
        key={service.id || i}
        ref={(el) => (servicesRef.current[i] = el)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: isEven ? 'row' : 'row-reverse',
          alignItems: 'center',
          gap: 'clamp(2rem, 4vw, 4.5rem)',
          padding: '2.5rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Image Section */}
        <div style={{ flex: '1 1 340px', position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', background: '#14110f' }}>
            <img
              src={service.desktopImg}
              srcSet={`${service.mobileImg} 800w, ${service.desktopImg} 1600w`}
              sizes="(max-width: 768px) 90vw, 45vw"
              alt={service.title}
              loading="lazy"
              className="faza-graded-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          {/* Floating Number */}
          <div
            style={{
              position: 'absolute',
              top: '-1.5rem',
              [isEven ? 'left' : 'right']: '-1.5rem',
              fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
              fontFamily: 'var(--font-serif)',
              color: 'rgba(201, 169, 110, 0.08)',
              pointerEvents: 'none',
              lineHeight: 1,
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Text Section */}
        <div style={{ flex: '1 1 340px', padding: '0.8rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <span
              style={{
                padding: '0.3rem 0.9rem',
                border: '1px solid rgba(201, 169, 110, 0.35)',
                background: 'rgba(201, 169, 110, 0.1)',
                borderRadius: '100px',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                fontWeight: 600,
                color: 'var(--color-accent)',
              }}
            >
              {service.tag}
            </span>
          </div>

          <h3 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', color: '#fff', marginBottom: '0.8rem', lineHeight: 1.15 }}>
            {service.title} <br />
            <em style={{ color: 'var(--color-accent)', fontSize: '0.85em', fontStyle: 'italic' }}>{service.subtitle}</em>
          </h3>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '1.6rem' }}>
            {service.desc}
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {service.features.map((f, idx) => (
              <li
                key={idx}
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <p style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontFamily: 'var(--font-serif)', color: '#fff', margin: 0, fontWeight: 600 }}>
              {service.price}
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Link
                to={`/booking?layanan=${encodeURIComponent(service.title + (service.subtitle ? ' ' + service.subtitle : ''))}`}
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.6rem',
                  border: '1px solid var(--color-accent)',
                  color: '#000',
                  background: 'var(--color-accent)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dfc28d';
                  e.currentTarget.style.borderColor = '#dfc28d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent)';
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                }}
              >
                Select Date
              </Link>
              <a
                href={getWhatsAppUrl(`Hello Faza Studio, I would like to book the "${service.title} ${service.subtitle}" package (${service.price}).`)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.3rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  background: 'rgba(255,255,255,0.04)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-wa-light, #2fe668)';
                  e.currentTarget.style.color = 'var(--color-wa-light, #2fe668)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '15px' }} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const servicesEl = document.getElementById('services-section');
    if (servicesEl) {
      const rect = servicesEl.getBoundingClientRect();
      if (rect.top < 50) {
        if (window.lenis) {
          window.lenis.scrollTo(servicesEl, { offset: -20, duration: 0.8 });
        } else {
          servicesEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <PageTransition>
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', minHeight: '200vh', background: 'var(--color-bg)' }}>
        {/* ===== HERO HEADER WITH FADED PHOTO BACKGROUND ===== */}
        <div ref={headerRef} style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}>
          {/* Animated Background Gallery (Moves Right) */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: 0.28 }}>
            <div ref={marqueeRef} style={{ display: 'flex', gap: '2vw', whiteSpace: 'nowrap', padding: '0 1vw', willChange: 'transform' }}>
              {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
                <div key={i} style={{ width: '25vw', minWidth: '280px', height: '40vh', borderRadius: '4px', overflow: 'hidden', background: '#14110f' }}>
                  <img src={src} alt="" loading="lazy" className="faza-graded-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Dark Scrim Gradient Overlay */}
          <div className="faza-scrim" style={{ background: 'radial-gradient(circle, rgba(20,17,15,0.75) 0%, rgba(14,12,10,0.96) 100%)' }} />

          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 1.5rem' }}>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1rem', fontWeight: 600 }}>
              FAZA STUDIO — EAST JAKARTA
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', letterSpacing: '0.04em', color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,0.9)', marginBottom: '1.2rem' }}>
              RATES & SERVICES
            </h1>
            <p style={{ fontSize: 'clamp(0.88rem, 1.6vw, 1.05rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', maxWidth: '650px', lineHeight: 1.6 }}>
              Retail Photoshoot Packages & Professional Creative Space Solutions
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
              <span style={{ display: 'inline-block', width: '25px', height: '1px', background: 'var(--color-accent)' }} />
              Scroll to explore packages
              <span style={{ display: 'inline-block', width: '25px', height: '1px', background: 'var(--color-accent)' }} />
            </div>
          </div>
        </div>

        {/* ===== SERVICES CONTENT SECTION ===== */}
        <div id="services-section" style={{ marginTop: '100vh', zIndex: 2, position: 'relative', background: 'var(--color-bg)', padding: '4.5rem 6% 7rem 6%' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Filter / Quick Jump Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: '✨ All Services' },
                { id: 'b2c', label: '🛍️ B2C Retail (Personal & Group)' },
                { id: 'b2b', label: '🏢 B2B Creative Space & Brand' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    padding: '0.65rem 1.6rem',
                    borderRadius: '40px',
                    border: activeTab === tab.id ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.12)',
                    background: activeTab === tab.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                    color: activeTab === tab.id ? '#000' : 'rgba(255,255,255,0.85)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ═════ GROUP 1: B2C RETAIL ═════ */}
            {(activeTab === 'all' || activeTab === 'b2c') && (
              <div style={{ marginBottom: '6rem' }}>
                <div style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '1.2rem', marginBottom: '3rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    CATEGORY 01
                  </span>
                  <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#fff', margin: '0 0 0.4rem 0' }}>
                    B2C Retail & Personal Sessions
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '680px', margin: 0 }}>
                    Personal photo studio sessions, executive portraits, graduation photos, and flexible hourly studio rental.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {b2cServices.map((s, idx) => renderServiceCard(s, idx))}
                </div>
              </div>
            )}

            {/* ═════ GROUP 2: B2B CREATIVE SPACE ═════ */}
            {(activeTab === 'all' || activeTab === 'b2b') && (
              <div>
                <div style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '1.2rem', marginBottom: '3rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    CATEGORY 02
                  </span>
                  <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#fff', margin: '0 0 0.4rem 0' }}>
                    B2B Creative Space & Commercial Production
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '680px', margin: 0 }}>
                    Commercial solutions for fashion brands, lookbooks, podcast recordings, full-day venue buyouts, and agency retainers.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {b2bServices.map((s, idx) => renderServiceCard(s, b2cServices.length + idx))}
                </div>
              </div>
            )}

            {/* Bottom Custom Consultation Banner */}
            <div
              style={{
                marginTop: '6rem',
                background: 'linear-gradient(135deg, rgba(21,18,15,0.9) 0%, rgba(14,12,10,0.95) 100%)',
                border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: '12px',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                textAlign: 'center',
              }}
            >
              <h3 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#fff', marginBottom: '0.8rem' }}>
                Need a Custom Production Proposal?
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                We accommodate multi-day production buyouts, specialized set constructions, commercial casting calls, and high-volume e-commerce catalogs.
              </p>
              <a
                href={getWhatsAppUrl('Hello Faza Studio, I would like to consult regarding custom production requirements and dates.')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.8rem 2rem',
                  background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px' }} />
                Consult with Studio Producer
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Layanan;
