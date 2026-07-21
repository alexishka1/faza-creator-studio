import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_IMAGES = [
  '/images/ASET RUANG FAZA/DSCF9515.jpg',
  '/images/ASET RUANG FAZA/DSCF9516.jpg',
  '/images/ASET RUANG FAZA/DSCF9517.jpg',
  '/images/ASET RUANG FAZA/DSCF9518.jpg',
  '/images/ASET RUANG FAZA/DSCF9519.jpg',
  '/images/ASET RUANG FAZA/DSCF9520.jpg',
  '/images/ASET RUANG FAZA/DSCF9527.jpg',
  '/images/ASET RUANG FAZA/DSCF9530.jpg',
];

const Layanan = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const marqueeRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Pin the header section while scrolling the cards
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: headerRef.current,
      pinSpacing: false,
    });

    // Infinite horizontal scrolling background
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 40, // Adjust this value to make it slower or faster
      repeat: -1
    });

    // Staggered slide up for pricing cards
    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(card, 
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <PageTransition>
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', minHeight: '200vh', background: 'var(--color-bg)' }}>
        
        <div ref={headerRef} style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}>
          
          {/* Animated Background Gallery */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: 0.35 }}>
            <div ref={marqueeRef} style={{ display: 'flex', gap: '2vw', whiteSpace: 'nowrap', padding: '0 1vw', willChange: 'transform' }}>
              {/* Duplicate array for seamless looping */}
              {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
                <div key={i} style={{ width: '25vw', minWidth: '300px', height: '40vh', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) contrast(1.1)' }} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Overlay to ensure text readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.95) 100%)' }} />

          {/* Foreground Text */}
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.1em', color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,0.9)' }}>LAYANAN KAMI</h1>
            <p style={{ marginTop: '2rem', fontSize: '1.2rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textShadow: '0 5px 15px rgba(0,0,0,0.9)' }}>Tailored experiences for your unique story.</p>
          </div>
        </div>

        <div style={{ marginTop: '100vh', zIndex: 1, position: 'relative', background: 'var(--color-bg)', padding: '5rem 0 10rem 0' }}>
          <div className="container">
            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              
              {/* Card 1 */}
              <div ref={el => cardsRef.current[0] = el} className="pricing-card" style={{ background: '#111', padding: '4rem', border: '1px solid #333' }}>
                <h3 className="pricing-title font-serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Portrait Session</h3>
                <div className="pricing-price" style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>$1,500</div>
                <ul className="pricing-list" style={{ listStyle: 'none', padding: 0, marginBottom: '3rem', lineHeight: '2' }}>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>2 Hours Studio Time</li>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>3 Wardrobe Changes</li>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>15 Retouched Digital Files</li>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>Online Gallery Access</li>
                </ul>
                <a href="#" className="btn-outline" style={{ display: 'inline-block', border: '1px solid #fff', padding: '1rem 2rem', textDecoration: 'none', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reserve Date</a>
              </div>

              {/* Card 2 */}
              <div ref={el => cardsRef.current[1] = el} className="pricing-card" style={{ background: '#111', padding: '4rem', border: '1px solid #333' }}>
                <h3 className="pricing-title font-serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Editorial Package</h3>
                <div className="pricing-price" style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--color-accent)' }}>$3,800</div>
                <ul className="pricing-list" style={{ listStyle: 'none', padding: 0, marginBottom: '3rem', lineHeight: '2' }}>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>Full Day Production</li>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>Creative Direction Included</li>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>50 Retouched Digital Files</li>
                  <li style={{ borderBottom: '1px solid #222', padding: '0.5rem 0' }}>Commercial Usage Rights</li>
                </ul>
                <a href="#" className="btn-outline" style={{ display: 'inline-block', border: '1px solid #fff', padding: '1rem 2rem', textDecoration: 'none', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reserve Date</a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Layanan;
