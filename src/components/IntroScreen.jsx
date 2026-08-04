import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import '../index.css';

const IntroScreen = ({ onStart }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const bgRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation
    const tl = gsap.timeline();
    
    // Slow zoom on background
    tl.to(bgRef.current, {
      scale: 1.15,
      duration: 15,
      ease: 'none',
      repeat: -1,
      yoyo: true
    }, 0);

    // Fade in text and button
    tl.fromTo(textRef.current, 
      { opacity: 0, y: 30, letterSpacing: '0.2em' },
      { opacity: 1, y: 0, letterSpacing: '0.5em', duration: 2.5, ease: 'power3.out' },
      1
    );
    
    tl.fromTo(buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
      3
    );

    // Button pulse
    gsap.to(buttonRef.current, {
      scale: 1.05,
      boxShadow: '0 0 20px rgba(255,255,255,0.3)',
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 5
    });

  }, []);

  const handleStartClick = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onStart) onStart();
      }
    });

    // 1. Camera Flash effect
    tl.to(flashRef.current, { opacity: 1, duration: 0.1, ease: 'power4.out' });
    
    // 2. Hide everything else during flash
    tl.set([textRef.current, buttonRef.current, bgRef.current], { opacity: 0 });
    
    // 3. Fade out flash slowly to reveal the actual app loading
    tl.to(flashRef.current, { opacity: 0, duration: 1.5, ease: 'power2.out' });
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050505',
        zIndex: 9999999, // Super high z-index to cover everything
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Cinematic Background */}
      <div 
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: -30, // Negative inset for zooming space
          backgroundImage: 'url(/images/gallery/unsplash_4.jpg)', // Using one of our downloaded premium photos
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(80%) brightness(0.2) contrast(1.2)',
          zIndex: 1
        }}
      />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.8rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          opacity: 0
        }}
        ref={el => {
          if(el) {
             gsap.to(el, {opacity: 1, duration: 2, delay: 0.5});
          }
        }}
        >
          Welcome To
        </p>

        <h1 
          ref={textRef}
          className="font-serif"
          style={{
            color: '#fff',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 'normal',
            margin: '0 0 4rem 0',
            textShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}
        >
          FAZA STUDIO
        </h1>

        <button
          ref={buttonRef}
          onClick={handleStartClick}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
            padding: '1.2rem 3.5rem',
            fontSize: '0.85rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            borderRadius: '100px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'background 0.3s ease, border 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
          }}
        >
          Mulai Jelajahi
        </button>

      </div>

      {/* Flash Layer */}
      <div 
        ref={flashRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#fff',
          zIndex: 10,
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default IntroScreen;
