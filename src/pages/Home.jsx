import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { B2C_SERVICES, B2B_SERVICES } from '../data/services';
import { MARQUEE_STUDIO_IMAGES, PORTFOLIO_ITEMS } from '../data/portfolio';
import { TESTIMONIALS, CLIENT_LOGOS, GOOGLE_REVIEWS_STATS } from '../data/testimonials';
import { STUDIO_INFO, getWhatsAppUrl } from '../data/contact';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

// Studio Highlights & Equipment Features
const STUDIO_FEATURES = [
  {
    tag: 'ZONE 01',
    title: 'Infinity Cyclorama Wall',
    desc: 'Seamless curved white cyclorama with top-tier ceiling truss lighting for shadowless commercial and portrait shoots.',
    image: '/images/optimized/DSCF9516-800.webp',
  },
  {
    tag: 'ZONE 02',
    title: 'Precision Lighting Rig',
    desc: 'Equipped with Godox strobe heads, continuous LED light banks, octaboxes, beauty dishes, and colored gel modifiers.',
    image: '/images/optimized/DSCF9527-800.webp',
  },
  {
    tag: 'ZONE 03',
    title: 'Sound-Treated Podcast Bay',
    desc: 'Acoustically insulated recording suite featuring multi-channel broadcast mics and cinematic ambient mood lighting.',
    image: '/images/optimized/DSCF9518-800.webp',
  },
  {
    tag: 'ZONE 04',
    title: 'Private Vanity & Lounge',
    desc: 'Dedicated styling salon with illuminated Hollywood mirrors, garment steamer, high-power AC, and client lounge.',
    image: '/images/optimized/DSCF9528-800.webp',
  },
];

const Home = () => {
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const pricingRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'b2c' | 'b2b'

  useEffect(() => {
    // Kill existing ScrollTriggers to prevent duplicate instances
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      // 1. Studio Gallery Marquee - Moves to the RIGHT (Tahap 2B requirement)
      if (marqueeInnerRef.current) {
        gsap.to(marqueeInnerRef.current, {
          xPercent: 50, // Positive translation slides towards the RIGHT
          ease: 'none',
          duration: 38,
          repeat: -1,
        });
      }

      // 2. Animate Section Headers
      gsap.utils.toArray('.reveal-header').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      });

      // 3. Stagger Pricing Cards
      gsap.utils.toArray('.pricing-card-anim').forEach((el, idx) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: (idx % 3) * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <PageTransition>
      <div style={{ backgroundColor: 'var(--color-bg)', color: '#fff', overflowX: 'hidden' }}>
        
        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1: RATES & PACKAGES (Directly Top / Above the Fold)
            ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={pricingRef}
          style={{
            paddingTop: 'clamp(5.5rem, 11vh, 8rem)',
            paddingBottom: 'clamp(3.5rem, 7vh, 5.5rem)',
            paddingLeft: '6%',
            paddingRight: '6%',
            background: 'linear-gradient(180deg, #120e0c 0%, var(--color-bg) 100%)',
            position: 'relative',
          }}
        >
          {/* Subtle Studio Backdrop with 18% Opacity & Dark Scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/images/optimized/DSCF9516-1600.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.16,
              filter: 'grayscale(60%) contrast(110%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 30%, rgba(18,14,12,0.7) 0%, var(--color-bg) 95%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            {/* Top Bar Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.8rem' }} className="reveal-header">
              <p
                style={{
                  fontSize: '0.78rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  marginBottom: '0.8rem',
                  fontWeight: 600,
                }}
              >
                FAZA STUDIO — EAST JAKARTA CREATIVE SPACE
              </p>
              <h1
                className="font-serif"
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.15,
                  margin: '0 0 1rem',
                  color: '#fff',
                }}
              >
                STUDIO RATES & PACKAGES
              </h1>
              <p
                style={{
                  fontSize: 'clamp(0.88rem, 1.6vw, 1.05rem)',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '680px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Studio rental and commercial production packages engineered for creators, brands, and agencies.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.8rem',
                marginBottom: '3.5rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { id: 'all', label: 'All Packages' },
                { id: 'b2c', label: 'B2C Retail & Personal' },
                { id: 'b2b', label: 'B2B Creative Space & Brand' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.65rem 1.6rem',
                    borderRadius: '40px',
                    border: activeTab === tab.id ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.12)',
                    background: activeTab === tab.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
                    color: activeTab === tab.id ? '#000' : 'rgba(255,255,255,0.85)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── 1. B2C Retail Packages Grid ── */}
            {(activeTab === 'all' || activeTab === 'b2c') && (
              <div style={{ marginBottom: '4.5rem' }}>
                <div style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
                    CATEGORY 01
                  </span>
                  <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#fff', margin: '0.2rem 0 0' }}>
                    B2C Retail & Personal Sessions
                  </h2>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                    gap: '1.8rem',
                  }}
                >
                  {B2C_SERVICES.map((s, idx) => (
                    <div
                      key={s.id}
                      className="pricing-card-anim"
                      style={{
                        backgroundColor: 'rgba(20, 16, 14, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        borderRadius: '12px',
                        padding: '1.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backdropFilter: 'blur(10px)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.4)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.2rem', backgroundColor: '#161210' }}>
                          <img
                            src={s.desktopImg}
                            alt={s.title}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700 }}>
                            {s.tag}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 0.5rem', fontWeight: 600 }}>
                          {s.title} <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{s.subtitle}</span>
                        </h3>

                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, margin: '0 0 1.2rem' }}>
                          {s.desc}
                        </p>

                        <div style={{ marginBottom: '1.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>
                            Rate
                          </span>
                          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4ade80' }}>
                            {s.price}
                          </span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {s.features.map((f, i) => (
                            <li key={i} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>✓</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={getWhatsAppUrl(`Hello Faza Studio, I would like to book the "${s.title} ${s.subtitle}" package (${s.price}).`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-wa-hover"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem',
                          background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          letterSpacing: '0.03em',
                          boxShadow: '0 4px 15px rgba(36, 215, 87, 0.35)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '16px' }} />
                        <span>Book via WhatsApp</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 2. B2B Creative Space & Brand Grid ── */}
            {(activeTab === 'all' || activeTab === 'b2b') && (
              <div>
                <div style={{ borderLeft: '3px solid #4ade80', paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#4ade80', fontWeight: 600 }}>
                    CATEGORY 02
                  </span>
                  <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#fff', margin: '0.2rem 0 0' }}>
                    B2B Creative Space & Commercial Production
                  </h2>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                    gap: '1.8rem',
                  }}
                >
                  {B2B_SERVICES.map((s, idx) => (
                    <div
                      key={s.id}
                      className="pricing-card-anim"
                      style={{
                        backgroundColor: 'rgba(20, 16, 14, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        borderRadius: '12px',
                        padding: '1.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backdropFilter: 'blur(10px)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.2rem', backgroundColor: '#161210' }}>
                          <img
                            src={s.desktopImg}
                            alt={s.title}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4ade80', fontWeight: 700 }}>
                            {s.tag}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 0.5rem', fontWeight: 600 }}>
                          {s.title} <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{s.subtitle}</span>
                        </h3>

                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, margin: '0 0 1.2rem' }}>
                          {s.desc}
                        </p>

                        <div style={{ marginBottom: '1.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>
                            Rate
                          </span>
                          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                            {s.price}
                          </span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {s.features.map((f, i) => (
                            <li key={i} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>✓</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={getWhatsAppUrl(`Hello Faza Studio, I would like to inquire about the commercial package "${s.title} ${s.subtitle}" (${s.price}).`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem',
                          background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          letterSpacing: '0.03em',
                          boxShadow: '0 4px 15px rgba(36, 215, 87, 0.35)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '16px' }} />
                        <span>Inquire on WhatsApp</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2: STUDIO SHOWCASE GALLERY (Marquee Moving to the RIGHT)
            ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={marqueeRef}
          style={{
            padding: '5rem 0',
            backgroundColor: '#0c0a09',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 6%' }} className="reveal-header">
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
              STUDIO SHOWCASE
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#fff', margin: '0.3rem 0 0' }}>
              Explore Our Creative Space & Sets
            </h2>
          </div>

          {/* Continuous Right-Moving Marquee */}
          <div style={{ width: '100%', overflow: 'hidden', display: 'flex' }}>
            <div
              ref={marqueeInnerRef}
              style={{
                display: 'flex',
                gap: '1.5rem',
                width: 'max-content',
                willChange: 'transform',
              }}
            >
              {[...MARQUEE_STUDIO_IMAGES, ...MARQUEE_STUDIO_IMAGES, ...MARQUEE_STUDIO_IMAGES].map((img, i) => (
                <div
                  key={i}
                  style={{
                    width: 'clamp(280px, 30vw, 420px)',
                    height: 'clamp(220px, 25vw, 300px)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    backgroundColor: '#161210',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '1rem',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                      {img.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              to="/karya"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <span>View Complete Portfolio & Works</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3: STUDIO INFRASTRUCTURE & HIGHLIGHTS
            ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 6%', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="reveal-header">
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
              PRODUCTION AMENITIES
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', margin: '0.4rem 0 0' }}>
              Built for Visual Precision & Creative Comfort
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {STUDIO_FEATURES.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#120f0d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={feat.image}
                    alt={feat.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.6rem' }}>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700 }}>
                    {feat.tag}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '0.4rem 0 0.6rem' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4: SOCIAL PROOF, CLIENT LOGOS & REVIEWS
            ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 6%', backgroundColor: '#0e0b0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Google Reviews Badge */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} className="reveal-header">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 1.2rem',
                  borderRadius: '30px',
                  backgroundColor: 'rgba(201, 169, 110, 0.12)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  marginBottom: '1rem',
                }}
              >
                <span style={{ color: '#fbbf24', fontSize: '1rem' }}>★★★★★</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                  {GOOGLE_REVIEWS_STATS.rating} / {GOOGLE_REVIEWS_STATS.maxRating} ({GOOGLE_REVIEWS_STATS.totalReviews})
                </span>
              </div>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#fff', margin: '0 0 0.5rem' }}>
                Trusted by Brands, Agencies & Creators
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', margin: 0 }}>
                Verified client experiences from commercial productions and portrait sessions in East Jakarta.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem', marginBottom: '4.5rem' }}>
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#15110f',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '1.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                      {'★'.repeat(t.rating)}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1.5rem' }}>
                      "{t.quote}"
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.8rem' }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{t.name}</p>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Brand Logos Strip */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '3rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, display: 'block', marginBottom: '2rem' }}>
                CREATIVE PARTNERS & CLIENT PRODUCTIONS
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(1.5rem, 4vw, 4rem)', flexWrap: 'wrap', opacity: 0.65 }}>
                {CLIENT_LOGOS.map((logo, i) => (
                  <span key={i} style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', color: '#fff' }}>
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5: BOTTOM CONSULTATION & INSTANT BOOKING BANNER
            ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 6%', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(25,20,17,0.95) 0%, rgba(14,11,10,0.98) 100%)',
              border: '1px solid rgba(201,169,110,0.25)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            }}
          >
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
              SCHEDULE YOUR PRODUCTION
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', margin: '0.6rem 0 1rem' }}>
              Ready to Create at Faza Studio?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              Check live calendar availability or discuss bespoke production requirements with our studio team directly via WhatsApp.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={getWhatsAppUrl('Hello Faza Studio, I would like to book a studio session and check schedule availability.')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 2.2rem',
                  background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '35px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  boxShadow: '0 6px 25px rgba(36, 215, 87, 0.45)',
                  transition: 'all 0.3s ease',
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px' }} />
                <span>Instant WhatsApp Booking</span>
              </a>

              <Link
                to="/layanan"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.85rem 2rem',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '35px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                Explore Full Rate Card
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;
