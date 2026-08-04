import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
      gsap.fromTo(heroTextRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 0.5 }
      );

      // 2. Philosophy Text Reveal
      const chars = philosophyRef.current.querySelectorAll('.reveal-text');
      gsap.fromTo(chars, 
        { color: 'rgba(255, 255, 255, 0.1)' },
        {
          color: 'rgba(255, 255, 255, 1)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: philosophyRef.current,
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
          }
        }
      );

      // 3. Stats Counter Animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(count1Ref.current, { innerHTML: 10, duration: 2, snap: { innerHTML: 1 } });
          gsap.to(count2Ref.current, { innerHTML: 500, duration: 2.5, snap: { innerHTML: 1 } });
          gsap.to(count3Ref.current, { innerHTML: 15, duration: 2, snap: { innerHTML: 1 } });
        }
      });

      // 4. Team Members Stagger
      gsap.fromTo(".team-card", 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 75%"
          }
        }
      );

      // 5. Client Marquee
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 25,
          repeat: -1
        });
      }

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const philosophyText = "Fotografi bukan tentang kamera. Fotografi adalah tentang bagaimana kita melihat dunia. Melalui FAZA STUDIO, kami mengabadikan hal-hal yang sering tidak terlihat.";
  const words = philosophyText.split(" ");

  const team = [
    { name: 'Ahmad Faza', role: 'Founder & Lead Photographer', img: '/images/gallery/unsplash_3.jpg' },
    { name: 'Diana Putri', role: 'Art Director', img: '/images/gallery/unsplash_4.jpg' },
    { name: 'Bima Sena', role: 'Senior Retoucher', img: '/images/gallery/unsplash_5.jpg' },
  ];

  const clients = ['VOGUE', 'HARPER\'S BAZAAR', 'GQ', 'ELLE', 'FORBES', 'VANITY FAIR', 'TIME', 'NATIONAL GEOGRAPHIC'];

  return (
    <PageTransition>
      <div ref={containerRef} style={{ background: 'var(--color-bg)', color: '#fff', minHeight: '100vh', overflow: 'hidden' }}>
        
        {/* ===== 1. HERO SECTION ===== */}
        <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Background image using unsplash_6 which looks like a studio or moody scene */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/gallery/unsplash_6.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%) brightness(0.3) contrast(1.2)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 40%)',
            zIndex: 1
          }} />
          
          <div ref={heroTextRef} style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 5%' }}>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
              The Visionary
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1, textShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
              KAMI BERCERITA<br/>MELALUI CAHAYA
            </h1>
          </div>
        </section>

        {/* ===== 2. PHILOSOPHY & SIGNATURE ===== */}
        <section style={{ padding: '15rem 5% 10rem 5%', textAlign: 'center' }}>
          <div ref={philosophyRef} style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
            {words.map((word, i) => (
              <span key={i} className="reveal-text font-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', fontWeight: 300, display: 'inline-block' }}>
                {word}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '5rem', opacity: 0.8 }}>
            {/* Elegant Signature Font Simulation */}
            <p style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '3rem', color: '#fff', transform: 'rotate(-5deg)', display: 'inline-block' }}>
              Faza
            </p>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '1rem', color: 'rgba(255,255,255,0.4)' }}>
              Founder, Faza Studio
            </p>
          </div>
        </section>

        {/* ===== 3. STATS / NUMBERS ===== */}
        <section ref={statsRef} style={{ padding: '8rem 5%', background: '#070707', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '4rem', textAlign: 'center' }}>
            
            <div>
              <div style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', fontFamily: 'var(--font-serif)', color: '#fff', lineHeight: 1 }}>
                <span ref={count1Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '1rem' }}>
                Tahun Pengalaman
              </p>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', fontFamily: 'var(--font-serif)', color: '#fff', lineHeight: 1 }}>
                <span ref={count2Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '1rem' }}>
                Sesi Pemotretan
              </p>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', fontFamily: 'var(--font-serif)', color: '#fff', lineHeight: 1 }}>
                <span ref={count3Ref}>0</span>+
              </div>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '1rem' }}>
                Penghargaan
              </p>
            </div>

          </div>
        </section>

        {/* ===== 4. THE TEAM ===== */}
        <section ref={teamRef} style={{ padding: '12rem 5% 8rem 5%' }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>The Creatives</p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>TIM KAMI</h2>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {team.map((member, i) => (
              <div key={i} className="team-card" style={{ cursor: 'pointer', group: 'team' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', marginBottom: '1.5rem', background: '#111' }}>
                  <img 
                    src={member.img} 
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(100%)',
                      transition: 'all 0.5s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'grayscale(100%)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{member.name}</h3>
                <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 5. CLIENT MARQUEE ===== */}
        <section style={{ padding: '5rem 0 10rem 0', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
             <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Dipercaya Oleh</p>
          </div>
          
          <div style={{ display: 'flex', opacity: 0.3, borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '2rem 0' }}>
            <div ref={marqueeRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
              {[...clients, ...clients].map((client, i) => (
                <span key={i} className="font-serif" style={{ fontSize: '2.5rem', margin: '0 4rem', letterSpacing: '0.1em' }}>
                  {client}
                </span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default TentangKami;
