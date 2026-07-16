import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

// Images from Drive with descriptions
const IMAGES = [
  { src: '/images/ASET RUANG FAZA/DSCF9516.jpg', title: 'CAHAYA & RUANG', desc: 'Harmoni antara pencahayaan alami dan struktur.' },
  { src: '/images/ASET RUANG FAZA/DSCF9527.jpg', title: 'SUDUT PANDANG', desc: 'Menemukan estetika dari perspektif yang berbeda.' },
  { src: '/images/ASET RUANG FAZA/DSCF9518.jpg', title: 'DETAIL TEKSTUR', desc: 'Menyoroti material dan kehalusan setiap permukaan.' },
  { src: '/images/ASET RUANG FAZA/DSCF9520.jpg', title: 'DIMENSI WAKTU', desc: 'Menangkap suasana ruang dalam keheningan.' },
];

const Home = () => {
  const heroImgRef = useRef(null);
  const heroTextRef = useRef(null);
  const pinnedRef = useRef(null);       // the pinned container
  const pinnedInnerRef = useRef(null);  // the content inside that gets pinned
  const pinnedTextLayerRef = useRef(null); // the background text to fade out
  const imgRefs = useRef([]);
  const textRevealRef = useRef(null);
  const clipSectionRef = useRef(null);
  const clipImageRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Kill any existing ScrollTriggers to prevent duplication on re-render
    ScrollTrigger.getAll().forEach(t => t.kill());

    const ctx = gsap.context(() => {

      // 1. Hero: text fades up on load
      gsap.from(heroTextRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Hero image slow parallax as you scroll past
      gsap.to(heroImgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroImgRef.current.parentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      // 2. Pinned section: text stays fixed in center while images scroll up one by one
      // Each image occupies 100vh of scroll progress
      const totalScrollLength = IMAGES.length * window.innerHeight;

      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: 'top top',
        end: `+=${totalScrollLength}`,
        pin: pinnedInnerRef.current,
        pinSpacing: true,
      });

      // Fade out the background text as the first image starts coming up
      gsap.to(pinnedTextLayerRef.current, {
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * 1.5}`, // Fade out over 1.5 viewport heights
          scrub: 1.5,
        }
      });

      // Each image slides in, stays a bit, then slides out
      imgRefs.current.forEach((imgEl, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedRef.current,
            // Start image animation based on its index
            start: `top+=${i * window.innerHeight * 0.9} top`,
            // The entire animation spans 2 viewport heights
            end: `top+=${(i * 0.9 + 2) * window.innerHeight} top`,
            scrub: 1.5,
          }
        });

        tl.fromTo(imgEl,
          { y: '100vh', opacity: 0 },
          { y: '0vh', opacity: 1, duration: 0.3, ease: 'power2.out' } // Slide in and fade in
        )
        .to(imgEl, 
          { y: '-10vh', duration: 0.4, ease: 'none' } // Slow drift in the center
        )
        .to(imgEl, 
          { y: '-100vh', opacity: 0, duration: 0.3, ease: 'power2.in' } // Slide out and fade out
        );
      });

      // 3. Text reveal: words light up as you scroll
      const words = textRevealRef.current.querySelectorAll('.reveal-word');
      gsap.fromTo(words,
        { color: 'rgba(255,255,255,0.1)' },
        {
          color: 'rgba(255,255,255,1)',
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: textRevealRef.current,
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // 4. Final clip-path reveal
      gsap.fromTo(clipImageRef.current,
        { clipPath: 'inset(35% 35% 35% 35% round 4px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: clipSectionRef.current,
            start: 'top 85%',
            end: 'top 15%',
            scrub: true,
          }
        }
      );

      // 5. Video Auto-Mute/Unmute
      ScrollTrigger.create({
        trigger: videoSectionRef.current,
        start: 'top 60%', // Trigger when top of video reaches 60% of viewport
        end: 'bottom 40%', // Trigger when bottom of video reaches 40% of viewport
        onEnter: () => { if (videoRef.current) videoRef.current.muted = false; },
        onLeave: () => { if (videoRef.current) videoRef.current.muted = true; },
        onEnterBack: () => { if (videoRef.current) videoRef.current.muted = false; },
        onLeaveBack: () => { if (videoRef.current) videoRef.current.muted = true; },
      });

    });

    return () => ctx.revert();
  }, []);

  const philosophyText = 'Setiap ruang menyimpan cerita. Kami melangkah masuk, membiarkan cahaya menuntun kami, dan membekukan momen yang berbicara lebih keras daripada sekadar kata-kata.';
  const words = philosophyText.split(' ');

  return (
    <PageTransition>
      <div style={{ background: 'var(--color-bg)', overflowX: 'hidden' }}>

        {/* ── 1. HERO ── */}
        <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div
            ref={heroImgRef}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url("/images/ASET RUANG FAZA/DSCF9515.jpg")',
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: 0.55,
            }}
          />
          {/* dark gradient overlay for readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.6) 100%)' }} />
          <div ref={heroTextRef} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              FOTOGRAFER INTERIOR & ARSITEKTUR
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)', letterSpacing: '0.05em', color: '#fff', lineHeight: 0.95 }}>
              SENI<br />MELIHAT
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '2rem' }}>
              Gulir ke bawah untuk menjelajahi
            </p>
          </div>
        </section>

        {/* ── 2. PINNED PARALLAX — text center, images scroll past ── */}
        {/* pinnedRef is the tall scroll container; pinnedInnerRef is what actually gets pinned */}
        <section ref={pinnedRef} style={{ position: 'relative' }}>
          <div
            ref={pinnedInnerRef}
            style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'var(--color-bg)',
            }}
          >
            {/* Background pinned label */}
            <div ref={pinnedTextLayerRef} style={{ position: 'absolute', zIndex: 0, textAlign: 'center', pointerEvents: 'none' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                KARYA KAMI
              </p>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textShadow: '0 8px 40px rgba(0,0,0,0.9)' }}>
                KESEIMBANGAN<br />BENTUK
              </h2>
            </div>

            {/* Images stacked in center, each will animate in via GSAP */}
            {IMAGES.map((item, i) => (
              <div
                key={i}
                ref={el => imgRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: '12vh',
                  // Alternate left/right positioning for visual interest
                  left: i % 2 === 0 ? '8vw' : 'auto',
                  right: i % 2 !== 0 ? '8vw' : 'auto',
                  width: i % 2 === 0 ? '40vw' : '38vw',
                  zIndex: 2 + i,
                  willChange: 'transform, opacity',
                }}
              >
                <div style={{ width: '100%', height: '65vh', overflow: 'hidden' }}>
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ marginTop: '1.5rem', textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', letterSpacing: '0.05em', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2.5 VIDEO SHOWREEL ── */}
        <section ref={videoSectionRef} style={{ padding: '15vh 8%', background: 'var(--color-bg)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '6vw' }}>
          {/* Kiri: Video Portrait */}
          <div style={{ flex: '0 0 auto', width: 'clamp(300px, 35vw, 450px)', height: '75vh', position: 'relative', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <video 
              ref={videoRef}
              src="/videos/vidio-about.MOV"
              autoPlay
              loop
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          {/* Kanan: Teks & Tombol Audio */}
          <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
              DI BALIK LAYAR
            </p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: '#fff', lineHeight: 1.1, marginBottom: '2rem' }}>
              MEREKAM <br/><span style={{ color: 'rgba(255,255,255,0.6)' }}>ESENSI</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '500px' }}>
              Di balik setiap foto yang memukau, terdapat proses panjang yang teliti. Kami memastikan setiap sorot cahaya, setiap sudut ruang, dan setiap komposisi berpadu sempurna sebelum tombol rana ditekan. Saksikan sekilas dedikasi kami di balik layar Faza Studio.
            </p>
          </div>
        </section>

        {/* ── 3. TEXT REVEAL ── */}
        <section style={{ padding: '20vh 8%', background: 'var(--color-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div ref={textRevealRef} style={{ maxWidth: '900px', display: 'flex', flexWrap: 'wrap', gap: '0.6rem 0.9rem', justifyContent: 'center' }}>
            {words.map((word, i) => (
              <span
                key={i}
                className="reveal-word font-serif"
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 3rem)', fontWeight: 300, lineHeight: 1.3, display: 'inline-block', color: 'rgba(255,255,255,0.1)' }}
              >
                {word}
              </span>
            ))}
          </div>
        </section>

        {/* ── 4. CLIP-PATH FINAL REVEAL ── */}
        <section
          ref={clipSectionRef}
          style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <div
            ref={clipImageRef}
            style={{ position: 'absolute', inset: 0 }}
          >
            <img
              src="/images/ASET RUANG FAZA/DSCF9524.jpg"
              alt="Temukan Ceritamu"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,5,0.35)' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', color: '#fff', letterSpacing: '0.05em', textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}>
              TEMUKAN<br />CERITAMU
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '1.5rem' }}>
              Hubungi kami untuk sesi foto
            </p>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;
