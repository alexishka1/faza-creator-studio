import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';
import { CLIENT_LOGOS } from '../data/testimonials';
import { STUDIO_INFO, getWhatsAppUrl } from '../data/contact';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const TentangKami = () => {
  const containerRef = useRef(null);
  const heroTextRef = useRef(null);
  const philosophyRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const marqueeRef = useRef(null);

  // Stats Counters
  const count1Ref = useRef(null);
  const count2Ref = useRef(null);
  const count3Ref = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Animation
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );

      // 2. Philosophy Text Reveal
      const chars = philosophyRef.current.querySelectorAll('.reveal-text');
      gsap.fromTo(
        chars,
        { opacity: 0.25 },
        {
          opacity: 1,
          stagger: 0.06,
          scrollTrigger: {
            trigger: philosophyRef.current,
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
          },
        }
      );

      // 3. Stats Counter Animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(count1Ref.current, { innerHTML: 8, duration: 2, snap: { innerHTML: 1 } });
          gsap.to(count2Ref.current, { innerHTML: 850, duration: 2.5, snap: { innerHTML: 1 } });
          gsap.to(count3Ref.current, { innerHTML: 140, duration: 2, snap: { innerHTML: 1 } });
        },
      });

      // 4. Team Members Stagger
      gsap.fromTo(
        '.team-card',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top 75%',
          },
        }
      );

      // 5. Client Marquee (Moving to the RIGHT - Tahap 2B)
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: 50,
          ease: 'none',
          duration: 30,
          repeat: -1,
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const philosophyText =
    'Photography is not merely pressing a shutter. It is the disciplined art of observation, capturing the authentic pulse of a moment, and engineering visual narratives that endure for individuals and brands alike.';
  const words = philosophyText.split(' ');

  const team = [
    { name: 'Ahmad Faza', role: 'Founder & Lead Visual Director', img: '/images/optimized/DSCF9516-800.webp' },
    { name: 'Diana Putri', role: 'Creative Director & Stylist', img: '/images/optimized/DSCF9527-800.webp' },
    { name: 'Bima Sena', role: 'Lighting & Post-Production Lead', img: '/images/optimized/DSCF9518-800.webp' },
  ];

  return (
    <PageTransition>
      <div ref={containerRef} style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', overflow: 'hidden', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
        {/* ===== 1. HERO SECTION WITH FADED PHOTO BACKGROUND ===== */}
        <section style={{ position: 'relative', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Faded Background Image */}
          <div
            className="faza-faded-bg"
            style={{
              backgroundImage: 'url("/images/optimized/DSCF9515-1600.webp")',
            }}
          />
          {/* Scrim Overlay */}
          <div className="faza-scrim" />

          <div ref={heroTextRef} style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(1.25rem, 6%, 5rem)', maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1.2rem', fontWeight: 600 }}>
              ● ABOUT FAZA STUDIO
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.2rem', color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              STORYTELLING<br />THROUGH LIGHT & SHADOW
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.92rem, 1.8vw, 1.05rem)', lineHeight: 1.7, fontWeight: 400, maxWidth: '640px', margin: '0 auto' }}>
              A modern creative space and photography studio in East Jakarta dedicated to producing refined commercial imagery, executive portraiture, and high-caliber productions.
            </p>
          </div>
        </section>

        {/* ===== 2. PHILOSOPHY & SIGNATURE ===== */}
        <section style={{ padding: 'clamp(4rem, 10vh, 8rem) 6% clamp(3rem, 6vh, 6rem) 6%', textAlign: 'center' }}>
          <div ref={philosophyRef} style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {words.map((word, i) => (
              <span key={i} className="reveal-text font-serif" style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.6rem)', fontWeight: 400, display: 'inline-block', lineHeight: 1.4, color: 'var(--color-text)' }}>
                {word}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '3.5rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '2.2rem', color: 'var(--color-accent)', margin: '0 0 0.4rem 0' }}>
              Faza Studio
            </p>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              East Jakarta, Indonesia
            </p>
          </div>
        </section>

        {/* ===== 3. STATS / NUMBERS ===== */}
        <section ref={statsRef} style={{ padding: 'clamp(3.5rem, 6vh, 5.5rem) 6%', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', lineHeight: 1 }}>
                <span ref={count1Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginTop: '0.6rem', fontWeight: 500 }}>
                Years of Experience
              </p>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', lineHeight: 1 }}>
                <span ref={count2Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginTop: '0.6rem', fontWeight: 500 }}>
                Production Sessions Completed
              </p>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', lineHeight: 1 }}>
                <span ref={count3Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginTop: '0.6rem', fontWeight: 500 }}>
                5-Star Google Reviews
              </p>
            </div>
          </div>
        </section>

        {/* ===== 4. THE TEAM ===== */}
        <section ref={teamRef} style={{ padding: 'clamp(4.5rem, 9vh, 7rem) clamp(1.25rem, 6%, 7rem)' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.6rem', fontWeight: 600 }}>
              DEDICATION & EXPERTISE
            </p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3rem)', color: 'var(--color-text)', letterSpacing: '-0.01em' }}>STUDIO CREATIVE TEAM</h2>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(1.2rem, 2.5vw, 2rem)' }}>
            {team.map((member, i) => (
              <div
                key={i}
                className="team-card"
                style={{
                  background: 'var(--color-bg-card)',
                  borderRadius: '12px',
                  padding: 'clamp(1rem, 2vw, 1.4rem)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--color-card-shadow)',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--color-card-shadow)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {/* 3/4 Portrait with CSS class for hover zoom */}
                <div className="team-portrait" style={{ marginBottom: '1.2rem', width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '6px', background: 'var(--color-bg-secondary)' }}>
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                    className="faza-graded-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <h3 className="font-serif" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.45rem)', marginBottom: '0.3rem', color: 'var(--color-text)', fontWeight: 400 }}>{member.name}</h3>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 5. CLIENT MARQUEE ===== */}
        <section style={{ padding: 'clamp(2rem, 4vh, 3.5rem) 0 clamp(3.5rem, 6vh, 5.5rem) 0', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
              TRUSTED BY LEADING BRANDS & CREATORS
            </p>
          </div>

          <div style={{ display: 'flex', opacity: 0.75, borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1.8rem 0' }}>
            <div ref={marqueeRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, i) => (
                <span key={i} className="font-serif" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', margin: '0 3rem', letterSpacing: '0.12em', color: 'var(--color-accent)' }}>
                  {client}
                </span>
              ))}
            </div>
          </div>

          {/* Direct CTA */}
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <a
              href={getWhatsAppUrl('Hello Faza Studio, I would like to visit the studio or discuss rental availability.')}
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
              Direct Studio Inquiry
            </a>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default TentangKami;
