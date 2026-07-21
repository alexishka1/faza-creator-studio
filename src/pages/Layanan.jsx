import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551316671-12ecdbb19ba9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800&auto=format&fit=crop',
];

const SERVICES = [
  {
    title: 'Portrait',
    subtitle: 'Session',
    price: 'Rp 1.500.000',
    tag: 'PERSONAL',
    desc: 'Sesi foto personal atau profesional dengan pencahayaan studio premium dan arahan gaya eksklusif untuk mengabadikan momen terbaik Anda.',
    features: ['2 Jam Sesi Studio', '3 Ganti Pakaian', '15 Foto Edited', 'Akses Galeri Online'],
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    color: '#c9a96e',
  },
  {
    title: 'Pre-Wedding',
    subtitle: 'Package',
    price: 'Rp 3.500.000',
    tag: 'ROMANTIC',
    desc: 'Cerita cinta yang diabadikan secara artistik dan sinematik. Konsep personal untuk momen paling berharga dalam hidup Anda.',
    features: ['Lokasi Bebas', 'Full Day Shoot', '50 Foto Edited', 'Highlight Video'],
    img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop',
    color: '#e8a0b4',
  },
  {
    title: 'Editorial',
    subtitle: '& Fashion',
    price: 'Rp 5.000.000',
    tag: 'PREMIUM',
    desc: 'Pemotretan komersial berstandar majalah internasional. Arahkan kreativitas Anda dengan tim kreatif kami yang berpengalaman.',
    features: ['Creative Direction', 'Stylist Included', '80 Foto Edited', 'Commercial Rights'],
    img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop',
    color: '#a0c4e8',
  },
  {
    title: 'Product',
    subtitle: '& Commercial',
    price: 'Rp 2.000.000',
    tag: 'BRAND',
    desc: 'Katalog produk berkualitas tinggi dengan detail sempurna untuk kebutuhan iklan, e-commerce, dan konten visual brand Anda.',
    features: ['30 Produk/Sesi', 'White/Dark BG', '40 Foto Edited', 'Brand Kit'],
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    color: '#a8e6a0',
  },
];

const Layanan = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const marqueeRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: headerRef.current,
        pinSpacing: false,
      });

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1
        });
      }

      // Section entrance animation
      gsap.fromTo(".services-deck-section",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-deck-section",
            start: "top 85%",
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const getCardStyle = (i) => {
    const total = SERVICES.length;
    const mid = (total - 1) / 2;
    const offset = i - mid;
    const isActive = hovered === i;

    // Fan/deck layout: rotate and offset each card
    const baseRotate = offset * 8; // degrees
    const baseX = offset * 120; // px spacing
    const baseY = Math.abs(offset) * 20; // arc effect

    return {
      position: 'absolute',
      left: '50%',
      bottom: '0',
      width: 'clamp(200px, 18vw, 240px)',
      height: 'clamp(320px, 40vw, 420px)',
      borderRadius: '120px 120px 0 0',
      overflow: 'hidden',
      cursor: 'pointer',
      transformOrigin: 'bottom center',
      transform: isActive
        ? `translateX(calc(-50% + ${baseX}px)) translateY(-60px) rotate(${baseRotate}deg) scale(1.25)`
        : `translateX(calc(-50% + ${baseX}px)) translateY(${baseY}px) rotate(${baseRotate}deg) scale(1)`,
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      zIndex: isActive ? 20 : 10 - Math.abs(offset),
      boxShadow: isActive
        ? `0 30px 80px rgba(0,0,0,0.9), 0 0 40px ${SERVICES[i].color}66`
        : '0 10px 30px rgba(0,0,0,0.6)',
      border: isActive ? `1px solid ${SERVICES[i].color}88` : '1px solid rgba(255,255,255,0.08)',
    };
  };

  const activeService = SERVICES[hovered ?? activeIndex];

  return (
    <PageTransition>
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', minHeight: '220vh', background: 'var(--color-bg)' }}>
        
        {/* ===== HERO HEADER ===== */}
        <div ref={headerRef} style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}>
          
          {/* Animated Background Gallery */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: 0.5 }}>
            <div ref={marqueeRef} style={{ display: 'flex', gap: '2vw', whiteSpace: 'nowrap', padding: '0 1vw', willChange: 'transform' }}>
              {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
                <div key={i} style={{ width: '25vw', minWidth: '300px', height: '40vh', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) contrast(1.1)' }} />
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.85) 100%)' }} />

          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Faza Studio</p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.1em', color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,0.9)' }}>LAYANAN KAMI</h1>
            <p style={{ marginTop: '2rem', fontSize: '1rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Tailored experiences for your unique story.</p>
            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <span style={{ display: 'inline-block', width: '30px', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
              Scroll untuk memilih layanan
              <span style={{ display: 'inline-block', width: '30px', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
            </div>
          </div>
        </div>

        {/* ===== DECK SELECTION SECTION ===== */}
        <div className="services-deck-section" style={{ marginTop: '100vh', zIndex: 1, position: 'relative', background: 'var(--color-bg)', padding: '0 0 8rem 0', minHeight: '120vh' }}>
          
          {/* Section label */}
          <div style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '2rem' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>— Pilih Layanan Anda —</p>
          </div>

          {/* Detail Panel (shows for hovered card) */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 4rem auto',
            padding: '0 2rem',
            textAlign: 'center',
            minHeight: '180px',
            transition: 'all 0.4s ease',
          }}>
            <div style={{
              display: 'inline-block',
              padding: '0.3rem 1.2rem',
              border: `1px solid ${activeService.color}66`,
              borderRadius: '100px',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              color: activeService.color,
              marginBottom: '1.2rem',
              transition: 'all 0.4s ease',
            }}>
              {activeService.tag}
            </div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', marginBottom: '1rem', transition: 'all 0.4s ease' }}>
              {activeService.title} <em style={{ color: activeService.color }}>{activeService.subtitle}</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem', transition: 'all 0.4s ease' }}>
              {activeService.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {activeService.features.map((f, i) => (
                <span key={i} style={{ padding: '0.4rem 1rem', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
                  {f}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: activeService.color, transition: 'all 0.4s ease' }}>
              {activeService.price}
            </p>
          </div>

          {/* ===== FAN/DECK CARD SELECTOR ===== */}
          <div style={{ position: 'relative', height: '480px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            {SERVICES.map((service, i) => (
              <div
                key={i}
                style={getCardStyle(i)}
                onMouseEnter={() => { setHovered(i); setActiveIndex(i); }}
                onMouseLeave={() => setHovered(null)}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: hovered === i ? 'grayscale(0%) brightness(0.85)' : 'grayscale(50%) brightness(0.4)',
                    transition: 'filter 0.5s ease, transform 0.5s ease',
                    transform: hovered === i ? 'scale(1.1)' : 'scale(1.0)',
                  }}
                />
                {/* Card overlay content */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '2rem 1.5rem 1.5rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)',
                }}>
                  {/* Number badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: hovered === i ? service.color : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: hovered === i ? '#000' : '#fff',
                    transition: 'all 0.4s ease',
                    border: `1px solid ${hovered === i ? service.color : 'rgba(255,255,255,0.15)'}`,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#fff', textAlign: 'center', marginBottom: '0.3rem', transition: 'all 0.4s ease' }}>
                    {service.title}
                  </h3>
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: service.color, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {service.tag}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '3rem' }}>
            {SERVICES.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: activeIndex === i ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: activeIndex === i ? s.color : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="#" style={{
              display: 'inline-block',
              padding: '1rem 3rem',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              borderRadius: '100px',
              transition: 'all 0.4s ease',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.04)'}
            >
              Pesan Sekarang
            </a>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Layanan;
