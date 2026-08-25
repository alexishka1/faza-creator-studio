import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { B2C_SERVICES, B2B_SERVICES } from '../data/services';
import { MARQUEE_STUDIO_IMAGES } from '../data/portfolio';
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
      // 1. Animate Section Headers
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
      <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', overflowX: 'hidden', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
        
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
            background: 'var(--color-bg)',
            position: 'relative',
          }}
        >
          {/* Subtle Studio Backdrop with Faded Photo & Dynamic Scrim */}
          <div
            className="faza-faded-bg"
            style={{
              backgroundImage: 'url(/images/optimized/DSCF9516-1600.webp)',
            }}
          />
          <div className="faza-scrim" />

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
                  color: 'var(--color-text)',
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
                    border: activeTab === tab.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                    background: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-bg-card)',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--color-text)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: 'var(--color-card-shadow)',
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
                  <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--color-text)', margin: '0.2rem 0 0' }}>
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
                        backgroundColor: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        padding: '1.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--color-card-shadow)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.boxShadow = 'var(--color-card-shadow)';
                      }}
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.2rem', backgroundColor: 'var(--color-bg-secondary)' }}>
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

                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', margin: '0 0 0.5rem', fontWeight: 600 }}>
                          {s.title} <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{s.subtitle}</span>
                        </h3>

                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: '0 0 1.2rem' }}>
                          {s.desc}
                        </p>

                        <div style={{ marginBottom: '1.4rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>
                            Rate
                          </span>
                          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                            {s.price}
                          </span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {s.features.map((f, i) => (
                            <li key={i} style={{ fontSize: '0.78rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                <div style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
                    CATEGORY 02
                  </span>
                  <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--color-text)', margin: '0.2rem 0 0' }}>
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
                        backgroundColor: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        padding: '1.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--color-card-shadow)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.boxShadow = 'var(--color-card-shadow)';
                      }}
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.2rem', backgroundColor: 'var(--color-bg-secondary)' }}>
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

                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', margin: '0 0 0.5rem', fontWeight: 600 }}>
                          {s.title} <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{s.subtitle}</span>
                        </h3>

                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: '0 0 1.2rem' }}>
                          {s.desc}
                        </p>

                        <div style={{ marginBottom: '1.4rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>
                            Rate
                          </span>
                          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                            {s.price}
                          </span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {s.features.map((f, i) => (
                            <li key={i} style={{ fontSize: '0.78rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>✓</span> {f}
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
            backgroundColor: 'var(--color-bg-secondary)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 6%' }} className="reveal-header">
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
              STUDIO SHOWCASE
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--color-text)', margin: '0.3rem 0 0' }}>
              Explore Our Creative Space & Sets
            </h2>
          </div>

          {/* Continuous Right-Moving Marquee */}
          <div className="marquee-container-wrapper">
            <div className="marquee-track-right">
              {[
                ...MARQUEE_STUDIO_IMAGES,
                ...MARQUEE_STUDIO_IMAGES,
                ...MARQUEE_STUDIO_IMAGES,
                ...MARQUEE_STUDIO_IMAGES,
              ].map((img, i) => (
                <div
                  key={i}
                  style={{
                    width: 'clamp(280px, 30vw, 420px)',
                    height: 'clamp(220px, 25vw, 300px)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    backgroundColor: 'var(--color-bg-card)',
                    boxShadow: 'var(--color-card-shadow)',
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
                      background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '1rem',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
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
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: 'var(--color-text)', margin: '0.4rem 0 0' }}>
              Built for Visual Precision & Creative Comfort
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {STUDIO_FEATURES.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--color-card-shadow)',
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
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', margin: '0.4rem 0 0.6rem' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
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
        <section style={{ padding: '6rem 6%', backgroundColor: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
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
                  backgroundColor: 'var(--color-accent-subtle)',
                  border: '1px solid var(--color-border-hover)',
                  marginBottom: '1rem',
                }}
              >
                <span style={{ color: '#fbbf24', fontSize: '1rem' }}>★★★★★</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text)', fontWeight: 600 }}>
                  {GOOGLE_REVIEWS_STATS.rating} / {GOOGLE_REVIEWS_STATS.maxRating} ({GOOGLE_REVIEWS_STATS.totalReviews})
                </span>
              </div>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--color-text)', margin: '0 0 0.5rem' }}>
                Trusted by Brands, Agencies & Creators
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Verified client experiences from commercial productions and portrait sessions in East Jakarta.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem', marginBottom: '4.5rem' }}>
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '1.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--color-card-shadow)',
                  }}
                >
                  <div>
                    <div style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                      {'★'.repeat(t.rating)}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1.5rem' }}>
                      "{t.quote}"
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.8rem' }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)' }}>{t.name}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Brand Logos Strip */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '2rem' }}>
                CREATIVE PARTNERS & CLIENT PRODUCTIONS
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(1.5rem, 4vw, 4rem)', flexWrap: 'wrap', opacity: 0.75 }}>
                {CLIENT_LOGOS.map((logo, i) => (
                  <span key={i} style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-text)' }}>
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
              background: 'linear-gradient(135deg, var(--color-bg-card) 0%, var(--color-bg-secondary) 100%)',
              border: '1px solid var(--color-border-hover)',
              boxShadow: 'var(--color-card-shadow)',
            }}
          >
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
              SCHEDULE YOUR PRODUCTION
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text)', margin: '0.6rem 0 1rem' }}>
              Ready to Create at Faza Studio?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
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
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  borderRadius: '35px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  boxShadow: 'var(--color-card-shadow)',
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
