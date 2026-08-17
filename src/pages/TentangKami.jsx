import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageTransition from '../components/PageTransition';
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
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.3, ease: 'power4.out', delay: 0.2 }
      );

      // 2. Philosophy Text Reveal
      const chars = philosophyRef.current.querySelectorAll('.reveal-text');
      gsap.fromTo(
        chars,
        { color: 'rgba(255, 255, 255, 0.18)' },
        {
          color: 'rgba(255, 255, 255, 1)',
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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top 75%',
          },
        }
      );

      // 5. Client Marquee
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: 'none',
          duration: 28,
          repeat: -1,
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const philosophyText =
    'Fotografi bukan sekadar menekan tombol kamera. Fotografi adalah seni mengamati, menangkap jiwa dari sebuah momen, dan merangkainya menjadi visual yang bernilai abadi bagi Anda dan brand Anda.';
  const words = philosophyText.split(' ');

  const team = [
    { name: 'Ahmad Faza', role: 'Founder & Lead Visual Director', img: '/images/optimized/DSCF9516-800.webp' },
    { name: 'Diana Putri', role: 'Creative Director & Stylist', img: '/images/optimized/DSCF9527-800.webp' },
    { name: 'Bima Sena', role: 'Lighting & Post-Production Lead', img: '/images/optimized/DSCF9518-800.webp' },
  ];

  const clients = ['LUMEN APPAREL', 'STUDIO EIGHT', 'NOIR ARCHIVE', 'METROPOLITAN MEDIA', 'AURORA BRAND', 'KREASI CO.'];

  return (
    <PageTransition>
      <div ref={containerRef} style={{ background: 'var(--color-bg)', color: '#fff', minHeight: '100vh', overflow: 'hidden' }}>
        {/* ===== 1. HERO SECTION WITH FADED PHOTO BACKGROUND ===== */}
        <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Faded Background Image (Spec: Opacity 20%) */}
          <div
            className="faza-faded-bg"
            style={{
              backgroundImage: 'url("/images/optimized/DSCF9515-1600.webp")',
              opacity: 0.22,
            }}
          />
          {/* Dark Scrim */}
          <div className="faza-scrim" />

          <div ref={heroTextRef} style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 6%', maxWidth: '900px' }}>
            <p style={{ fontSize: '0.85rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1.5rem', fontWeight: 600 }}>
              ● TENTANG FAZA STUDIO
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.5rem)', lineHeight: 1.1, textShadow: '0 20px 40px rgba(0,0,0,0.8)', marginBottom: '1.5rem' }}>
              KAMI BERCERITA<br />MELALUI CAHAYA
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.7, fontWeight: 400 }}>
              Creative Space & Studio Foto di Ciracas, Jakarta Timur yang didedikasikan untuk menghadirkan karya visual berstandar tinggi dengan suasana yang hangat dan inklusif.
            </p>
          </div>
        </section>

        {/* ===== 2. PHILOSOPHY & SIGNATURE ===== */}
        <section style={{ padding: 'clamp(5rem, 14vh, 12rem) 6% clamp(4rem, 8vh, 8rem) 6%', textAlign: 'center' }}>
          <div ref={philosophyRef} style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
            {words.map((word, i) => (
              <span key={i} className="reveal-text font-serif" style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3.4rem)', fontWeight: 400, display: 'inline-block', lineHeight: 1.35 }}>
                {word}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '4.5rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '2.5rem', color: 'var(--color-accent)', margin: '0 0 0.5rem 0' }}>
              Faza Studio
            </p>
            <p style={{ fontSize: '0.82rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              Jakarta Timur, Indonesia
            </p>
          </div>
        </section>

        {/* ===== 3. STATS / NUMBERS ===== */}
        <section ref={statsRef} style={{ padding: 'clamp(4rem, 8vh, 7rem) 6%', background: 'var(--color-bg-card)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'clamp(3.8rem, 7vw, 5.5rem)', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', lineHeight: 1 }}>
                <span ref={count1Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.88rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginTop: '0.8rem', fontWeight: 500 }}>
                Tahun Pengalaman
              </p>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(3.8rem, 7vw, 5.5rem)', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', lineHeight: 1 }}>
                <span ref={count2Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.88rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginTop: '0.8rem', fontWeight: 500 }}>
                Sesi Foto & Produksi
              </p>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(3.8rem, 7vw, 5.5rem)', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', lineHeight: 1 }}>
                <span ref={count3Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.88rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginTop: '0.8rem', fontWeight: 500 }}>
                Ulasan Bintang 5 di Google
              </p>
            </div>
          </div>
        </section>

        {/* ===== 4. THE TEAM ===== */}
        <section ref={teamRef} style={{ padding: 'clamp(5rem, 10vh, 10rem) 6%' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.8rem', fontWeight: 600 }}>
              DEDIKASI & KREATIVITAS
            </p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>TIM FAZA STUDIO</h2>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            {team.map((member, i) => (
              <div key={i} className="team-card" style={{ background: '#151210', borderRadius: '8px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '6px', marginBottom: '1.2rem', background: '#111' }}>
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                    className="faza-graded-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.4rem', color: '#fff' }}>{member.name}</h3>
                <p style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 5. CLIENT MARQUEE ===== */}
        <section style={{ padding: 'clamp(2rem, 4vh, 4rem) 0 clamp(4rem, 8vh, 7rem) 0', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
              DIPERCAYA OLEH BRAND & KREATOR
            </p>
          </div>

          <div style={{ display: 'flex', opacity: 0.65, borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '2rem 0' }}>
            <div ref={marqueeRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
              {[...clients, ...clients].map((client, i) => (
                <span key={i} className="font-serif" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', margin: '0 3.5rem', letterSpacing: '0.12em', color: 'var(--color-accent)' }}>
                  {client}
                </span>
              ))}
            </div>
          </div>

          {/* Direct CTA */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <a
              href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20tertarik%20untuk%20berkunjung%20atau%20tanya%20sewa%20studio."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.95rem 2.2rem',
                background: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '50px',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
              }}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#fff' }} />
              Hubungi & Kunjungi Studio
            </a>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default TentangKami;
