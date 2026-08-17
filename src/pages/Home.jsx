import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

// Authentic Faza Studio Ruang & Setup Photos (Optimized WebP)
const IMAGES = [
  {
    desktopSrc: '/images/optimized/DSCF9516-1600.webp',
    mobileSrc: '/images/optimized/DSCF9516-800.webp',
    title: 'ZONA CYCLORAMA & NATURAL LIGHT',
    desc: 'Ruang utama dengan dinding lengkung tanpa batas dan pencahayaan studio terintegrasi.',
  },
  {
    desktopSrc: '/images/optimized/DSCF9527-1600.webp',
    mobileSrc: '/images/optimized/DSCF9527-800.webp',
    title: 'AREA PEMOTRETAN PORTRAIT',
    desc: 'Setup lighting continuous & flash profesional untuk foto personal dan lookbook brand.',
  },
  {
    desktopSrc: '/images/optimized/DSCF9518-1600.webp',
    mobileSrc: '/images/optimized/DSCF9518-800.webp',
    title: 'RUANG PODCAST & KORPORAT',
    desc: 'Suasana privat ber-AC dengan akustik nyaman untuk produksi talkshow dan konten digital.',
  },
  {
    desktopSrc: '/images/optimized/DSCF9520-1600.webp',
    mobileSrc: '/images/optimized/DSCF9520-800.webp',
    title: 'KOMERSIAL & PRODUCT DISPLAY',
    desc: 'Meja display dan aneka backdrop warna untuk katalog produk dan visual advertising.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Aditya Pratama',
    role: 'Brand Founder & Apparel Owner',
    type: 'Product & Commercial Shoot',
    rating: 5,
    text: 'Studio paling proper di Jakarta Timur. Lighting setup-nya sangat lengkap, tempatnya bersih dan estetik, AC dingin, dan timnya sangat helpful mengarahkan angle produk kami.',
    avatar: '👨‍💼',
  },
  {
    name: 'Sarah Nabila',
    role: 'Content Creator & Model',
    type: 'Editorial & Personal Portrait',
    rating: 5,
    text: 'Suka banget sama ambiance dan cyclorama wall-nya. Hasil foto portrait-nya bener-bener berkarakter, tone warnanya mewah, dan sesuai banget dengan moodboard yang aku mau!',
    avatar: '👩‍🎨',
  },
  {
    name: 'Dimas & Vania',
    role: 'Graduation & Family Group',
    type: 'Together Moment & Studio Rent',
    rating: 5,
    text: 'Sewa studio 2 jam buat foto grup wisuda bareng sahabat. Raw files langsung dikirim hari itu juga dan hasil editannya rapi banget. Tempatnya luas dan nyaman buat ramean.',
    avatar: '🎓',
  },
];

const CLIENT_LOGOS = [
  'LUMEN APPAREL',
  'STUDIO EIGHT',
  'NOIR ARCHIVE',
  'METROPOLITAN MEDIA',
  'AURORA BRAND',
  'KREASI CO.',
];

const Home = () => {
  const heroImgRef = useRef(null);
  const heroTextRef = useRef(null);
  const pinnedRef = useRef(null);
  const pinnedInnerRef = useRef(null);
  const pinnedTextLayerRef = useRef(null);
  const imgRefs = useRef([]);
  const textRevealRef = useRef(null);
  const clipSectionRef = useRef(null);
  const clipImageRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    // Kill any existing ScrollTriggers to prevent duplication on re-render
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      // 1. Hero: stagger text and scale background on load
      gsap.fromTo(heroImgRef.current, { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power3.out' });

      gsap.from(heroTextRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.2,
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
        },
      });

      // 2. Pinned section: text stays fixed in center while images scroll up one by one
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
          end: `+=${window.innerHeight * 1.4}`,
          scrub: 1.5,
        },
      });

      // Each image slides in, stays a bit, then slides out
      imgRefs.current.forEach((imgEl, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedRef.current,
            start: `top+=${i * window.innerHeight * 0.9} top`,
            end: `top+=${(i * 0.9 + 2) * window.innerHeight} top`,
            scrub: 1.5,
          },
        });

        tl.fromTo(
          imgEl,
          { y: '100vh', opacity: 0, scale: 0.9, rotation: i % 2 === 0 ? 2 : -2 },
          { y: '0vh', opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'power3.out' }
        )
          .to(imgEl, { y: '-8vh', duration: 0.4, ease: 'none' })
          .to(imgEl, { y: '-100vh', opacity: 0, scale: 0.9, rotation: i % 2 === 0 ? -2 : 2, duration: 0.4, ease: 'power3.in' });
      });

      // 3. Text reveal: words light up and rise as you scroll
      const words = textRevealRef.current.querySelectorAll('.reveal-word');
      gsap.fromTo(
        words,
        { color: 'rgba(255,255,255,0.18)', y: 15 },
        {
          color: 'rgba(255,255,255,1)',
          y: 0,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRevealRef.current,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: 1.2,
          },
        }
      );

      // 4. Final clip-path reveal with scaling
      gsap.fromTo(
        clipImageRef.current,
        { clipPath: 'inset(20% 20% 20% 20% round 12px)', scale: 1.15 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          scale: 1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: clipSectionRef.current,
            start: 'top 85%',
            end: 'top 15%',
            scrub: 1.5,
          },
        }
      );

      // 5. Video Auto-Mute/Unmute
      ScrollTrigger.create({
        trigger: videoSectionRef.current,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          if (videoRef.current) videoRef.current.muted = false;
        },
        onLeave: () => {
          if (videoRef.current) videoRef.current.muted = true;
        },
        onEnterBack: () => {
          if (videoRef.current) videoRef.current.muted = false;
        },
        onLeaveBack: () => {
          if (videoRef.current) videoRef.current.muted = true;
        },
      });

      gsap.to(videoRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: videoSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const philosophyText =
    'Setiap sudut ruang Faza Studio dirancang untuk memberi Anda kebebasan berekspresi. Tata cahaya terarah, cyclorama bersih, dan suasana privat siap menghidupkan setiap visi kreatif Anda.';
  const words = philosophyText.split(' ');

  return (
    <PageTransition>
      <div style={{ background: 'var(--color-bg)', overflowX: 'hidden' }}>
        {/* ── 1. HERO WITH FADED PHOTO BACKGROUND & SCRIM ── */}
        <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Faded Authentic Photo Background (Spec: Opacity 20%, Warm grade) */}
          <div
            ref={heroImgRef}
            className="faza-faded-bg"
            style={{
              backgroundImage: 'url("/images/optimized/DSCF9515-1600.webp")',
              opacity: 0.25,
            }}
          />
          {/* Dark Scrim Gradient Overlay: Spec 55-85% */}
          <div className="faza-scrim" />

          {/* Hero Foreground Content */}
          <div ref={heroTextRef} style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', maxWidth: '920px' }}>
            <p style={{ color: 'var(--color-accent)', letterSpacing: '0.25em', fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)', textTransform: 'uppercase', marginBottom: '1.2rem', fontWeight: 600 }}>
              ● Creative Space & Photo Studio — Jakarta Timur
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3.2rem, 8vw, 7.8rem)', letterSpacing: '0.04em', color: '#fff', lineHeight: 0.95, marginBottom: '1.2rem' }}>
              SENI<br />MELIHAT
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', lineHeight: 1.65, maxWidth: '680px', margin: '0 auto 2.2rem', fontWeight: 400 }}>
              Ruang kreatif berkonsep estetik di Ciracas, Jakarta Timur untuk sewa studio per jam, foto portrait, grup wisuda, dan produksi visual komersial brand Anda.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20tertarik%20untuk%20booking%20atau%20tanya%20jadwal%20studio."
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
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderRadius: '50px',
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#fff' }} />
                Booking via WhatsApp
              </a>
              <a
                href="/layanan"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.95rem 2rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  borderRadius: '50px',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent)';
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                Cek Fasilitas & Harga
              </a>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', fontSize: '0.78rem', textTransform: 'uppercase', marginTop: '2.5rem' }}>
              Gulir ke bawah untuk melihat ruang studio
            </p>
          </div>
        </section>

        {/* ── 2. PINNED PARALLAX — EKSPLORASI RUANG ASLI FAZA STUDIO ── */}
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
              <p style={{ color: 'var(--color-accent)', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
                EKSPLORASI RUANG
              </p>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)', color: 'rgba(255,255,255,0.95)', letterSpacing: '0.06em', textShadow: '0 8px 40px rgba(0,0,0,0.9)' }}>
                FASILITAS<br />& SUDUT KARYA
              </h2>
            </div>

            {/* Authentic Studio Images (WebP + Graded) */}
            {IMAGES.map((item, i) => (
              <div
                key={i}
                ref={(el) => (imgRefs.current[i] = el)}
                style={{
                  position: 'absolute',
                  top: '12vh',
                  left: i % 2 === 0 ? '8vw' : 'auto',
                  right: i % 2 !== 0 ? '8vw' : 'auto',
                  width: i % 2 === 0 ? '42vw' : '40vw',
                  zIndex: 2 + i,
                  willChange: 'transform, opacity',
                }}
              >
                <div style={{ width: '100%', height: '65vh', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', background: '#14110f' }}>
                  <img
                    src={item.desktopSrc}
                    srcSet={`${item.mobileSrc} 800w, ${item.desktopSrc} 1600w`}
                    sizes="(max-width: 768px) 90vw, 45vw"
                    alt={item.title}
                    loading="lazy"
                    className="faza-graded-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ marginTop: '1.5rem', textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.35rem', color: '#fff', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', letterSpacing: '0.03em', lineHeight: 1.6, fontWeight: 400 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2.5 VIDEO SHOWREEL & SETUP FACILITY ── */}
        <section ref={videoSectionRef} style={{ padding: '15vh 6%', background: 'var(--color-bg)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '6vw' }}>
          {/* Kiri: Video Portrait */}
          <div style={{ flex: '0 0 auto', width: 'clamp(290px, 35vw, 440px)', height: '75vh', position: 'relative', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', background: '#14110f' }}>
            <video
              ref={videoRef}
              src="/videos/vidio-about.MOV"
              autoPlay
              loop
              playsInline
              muted
              preload="metadata"
              style={{ width: '100%', height: '120%', objectFit: 'cover', transform: 'translateY(-10%)' }}
            />
          </div>

          {/* Kanan: Teks & Action Buttons */}
          <div style={{ flex: '1 1 380px', maxWidth: '580px' }}>
            <p style={{ color: 'var(--color-accent)', letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
              DI BALIK LAYAR & FASILITAS
            </p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', color: '#fff', lineHeight: 1.15, marginBottom: '1.8rem' }}>
              RUANG NYAMAN, <br /><span style={{ color: 'var(--color-accent)' }}>HASIL MAKSIMAL</span>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 400 }}>
              Kami menyediakan cyclorama wall yang terawat, continuous & strobe lighting, AC dingin, ruang rias privat, serta koneksi WiFi berkecepatan tinggi agar setiap sesi foto dan rekaman podcast Anda berjalan lancar tanpa hambatan.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="/layanan"
                style={{
                  padding: '0.9rem 2rem',
                  background: 'var(--color-accent)',
                  color: '#000',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dfc28d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-accent)')}
              >
                Cek Paket & Harga Sewa
              </a>
              <a
                href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20mau%20tanya%20ketersediaan%20alat%20dan%20jadwal%20studio."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.9rem 2rem',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
              >
                Tanya Ketersediaan Jadwal
              </a>
            </div>
          </div>
        </section>

        {/* ── 2.8 SOCIAL PROOF & GOOGLE REVIEWS SECTION ── */}
        <section ref={reviewsRef} style={{ padding: '12vh 6%', background: 'var(--color-bg-card)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Rating Header */}
            <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '30px', marginBottom: '1.2rem' }}>
                <span style={{ color: 'var(--color-accent)', fontSize: '1rem' }}>★★★★★</span>
                <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>4.9 / 5.0 di Google Maps (140+ Ulasan)</span>
              </div>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#fff', margin: '0 0 1rem 0' }}>
                Dipercaya Ratusan Klien & Kreator
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
                Pengalaman nyata dari mereka yang telah mempercayakan momen personal, wisuda, hingga produksi visual komersial brand bersama Faza Studio.
              </p>
            </div>

            {/* Testimonials Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0d0b09',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '2.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span style={{ color: 'var(--color-accent)', fontSize: '1rem', letterSpacing: '2px' }}>★★★★★</span>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600, background: 'rgba(201, 169, 110, 0.1)', padding: '0.25rem 0.7rem', borderRadius: '20px', border: '1px solid rgba(201, 169, 110, 0.2)' }}>
                        {t.type}
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '2rem' }}>
                      "{t.text}"
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.2rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1c1815', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{t.name}</h4>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Logos / Collaboration Bar */}
            <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '2rem', fontWeight: 600 }}>
                KOLABORASI & KLIEN KOMERSIAL KAMI
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(2rem, 5vw, 4rem)', flexWrap: 'wrap', opacity: 0.75 }}>
                {CLIENT_LOGOS.map((logo, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                      letterSpacing: '0.15em',
                      color: 'var(--color-accent)',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. MANIFESTO & ACTION SECTION (FADED PHOTO BG + NO DEAD END) ── */}
        <section style={{ padding: '16vh 6%', background: 'var(--color-bg)', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Faded background scrim for section transition */}
          <div
            className="faza-faded-bg"
            style={{
              backgroundImage: 'url("/images/optimized/DSCF9527-1600.webp")',
              opacity: 0.16,
            }}
          />
          <div className="faza-scrim" />

          <div ref={textRevealRef} style={{ position: 'relative', zIndex: 2, maxWidth: '920px', display: 'flex', flexWrap: 'wrap', gap: '0.6rem 0.9rem', justifyContent: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
            {words.map((word, i) => (
              <span
                key={i}
                className="reveal-word font-serif"
                style={{ fontSize: 'clamp(1.5rem, 3.8vw, 3.2rem)', fontWeight: 400, lineHeight: 1.35, display: 'inline-block', color: 'rgba(255,255,255,0.18)' }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Interactive Next Steps Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '800px',
              width: '100%',
              background: 'linear-gradient(180deg, rgba(21,18,15,0.92) 0%, rgba(14,12,10,0.95) 100%)',
              border: '1px solid rgba(201,169,110,0.2)',
              borderRadius: '12px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#fff', marginBottom: '1rem' }}>
              Jadikan Momen Anda Lebih Berarti
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '550px', margin: '0 auto 2rem', fontWeight: 400 }}>
              Sewa ruang studio mulai dari Rp150.000/jam atau pesan paket foto profesional kami dengan jadwal yang fleksibel.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20ingin%20tanya%20jadwal%20dan%20paket%20foto."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 2.2rem',
                  background: '#25D366',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '50px',
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#fff' }} />
                Konsultasi WhatsApp
              </a>
              <a
                href="/layanan"
                style={{
                  padding: '0.9rem 2rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '50px',
                  background: 'rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent)';
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                Lihat Daftar Harga
              </a>
            </div>
          </div>
        </section>

        {/* ── 4. CLIP-PATH FINAL REVEAL (FADED PHOTO BG + DIRECT CTA) ── */}
        <section
          ref={clipSectionRef}
          style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <div ref={clipImageRef} style={{ position: 'absolute', inset: 0 }}>
            <img
              src="/images/optimized/DSCF9524-1600.webp"
              srcSet="/images/optimized/DSCF9524-800.webp 800w, /images/optimized/DSCF9524-1600.webp 1600w"
              sizes="100vw"
              alt="Temukan Ceritamu"
              loading="lazy"
              className="faza-graded-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
            />
            {/* Dark Scrim Gradient Overlay */}
            <div className="faza-scrim" />
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem' }}>
            <p style={{ color: 'var(--color-accent)', letterSpacing: '0.3em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
              FAZA STUDIO JAKARTA TIMUR
            </p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', color: '#fff', letterSpacing: '0.05em', textShadow: '0 4px 30px rgba(0,0,0,0.6)', marginBottom: '1.2rem' }}>
              TEMUKAN<br />CERITAMU
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', letterSpacing: '0.15em', fontSize: '0.92rem', textTransform: 'uppercase', marginBottom: '2.5rem', fontWeight: 500 }}>
              Hubungi kami untuk reservasi sesi foto & sewa studio
            </p>
            <a
              href="https://wa.me/6285933585829?text=Halo%20Faza%20Studio%2C%20saya%20ingin%20reservasi%20sesi%20foto."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '1rem 2.6rem',
                background: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '50px',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px', color: '#fff' }} />
              Hubungi via WhatsApp
            </a>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
