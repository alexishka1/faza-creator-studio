import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../index.css';

// Komponen Kamera Bersayap Kustom
const WingedCamera = () => {
  return (
    <div className="winged-cam" style={{ position: 'relative', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      
      {/* Sayap Kiri */}
      <svg className="wing-left" width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ position: 'absolute', left: '-14px', top: '4px', transformOrigin: 'right center' }}>
        <path d="M22,12 C15,2 5,8 2,16 C8,14 15,18 22,12 Z" />
      </svg>
      
      {/* Sayap Kanan */}
      <svg className="wing-right" width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ position: 'absolute', right: '-14px', top: '4px', transformOrigin: 'left center' }}>
        <path d="M2,12 C9,2 19,8 22,16 C16,14 9,18 2,12 Z" />
      </svg>
      
      {/* Bodi Kamera */}
      <div style={{ position: 'relative', zIndex: 2, background: '#0a0a0a', borderRadius: '4px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      </div>

      <style>{`
        @keyframes flapLeft {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-40deg); }
        }
        @keyframes flapRight {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(40deg); }
        }
        @keyframes hoverCam {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .wing-left {
          animation: flapLeft 0.15s infinite ease-in-out;
        }
        .wing-right {
          animation: flapRight 0.15s infinite ease-in-out;
        }
        .winged-cam {
          animation: hoverCam 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

const Loader = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  const loaderRef = useRef(null);
  const topShutterRef = useRef(null);
  const bottomShutterRef = useRef(null);
  const barRef = useRef(null);
  const cameraWrapperRef = useRef(null);
  const textRef = useRef(null);
  const flashRef = useRef(null);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    setIsLoading(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
      }
    });

    // Reset styles for route change
    gsap.set(loaderRef.current, { display: 'block' });
    gsap.set(topShutterRef.current, { yPercent: 0 });
    gsap.set(bottomShutterRef.current, { yPercent: 0 });
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });
    gsap.set(cameraWrapperRef.current, { left: '0%', opacity: 1 });
    gsap.set(textRef.current, { opacity: 1 });
    gsap.set(flashRef.current, { opacity: 0 });
    progressRef.current.value = 0;

    // 1. Loading Bar Animates Width
    tl.to(barRef.current, {
      scaleX: 1,
      duration: 3,
      ease: "power2.inOut"
    }, 0);

    // 1.1 Camera Flies Along the Bar
    tl.to(cameraWrapperRef.current, {
      left: '100%',
      duration: 3,
      ease: "power2.inOut"
    }, 0);

    // 1.2 Percentage Counter 0-100%
    tl.to(progressRef.current, {
      value: 100,
      duration: 3,
      ease: "power2.inOut",
      onUpdate: () => {
        if (textRef.current) {
          textRef.current.textContent = `${Math.round(progressRef.current.value)}%`;
        }
      }
    }, 0);

    // 2. Hide UI elements just before shutter opens
    tl.to([barRef.current, textRef.current, cameraWrapperRef.current], {
      opacity: 0,
      duration: 0.3
    }, 3.2);

    // 3. Camera Flash!
    tl.to(flashRef.current, { opacity: 1, duration: 0.1, ease: 'power4.out' }, 3.5);
    
    // 4. Shutter opens exactly at the peak of the flash
    tl.to(topShutterRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 3.55);
    tl.to(bottomShutterRef.current, { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, 3.55);
    
    // Fade out flash slowly to reveal the crisp page behind it
    tl.to(flashRef.current, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 3.6);

    // 5. Hide completely from DOM
    tl.set(loaderRef.current, { display: 'none' });

  }, [location.pathname]);

  return (
    <div 
      ref={loaderRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999, // Absolute top layer
        pointerEvents: isLoading ? 'all' : 'none'
      }}
    >
      {/* Top Shutter */}
      <div 
        ref={topShutterRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50vh',
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}
      />
      
      {/* Bottom Shutter */}
      <div 
        ref={bottomShutterRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50vh',
          backgroundColor: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.03)'
        }}
      />

      {/* Loading UI Container (Centered) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10
      }}>

        {/* Flying Camera Overlay on Line */}
        <div style={{ position: 'relative', width: '100%', height: '50px' }}>
          
          {/* Background Track Line (Thicker and transparent) */}
          <div style={{ position: 'absolute', top: '23px', left: 0, width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          
          {/* Active Progress Line (Thicker) */}
          <div 
            ref={barRef}
            style={{ position: 'absolute', top: '23px', left: 0, width: '100%', height: '4px', backgroundColor: '#fff', borderRadius: '2px', zIndex: 1 }}
          />

          {/* Flying Camera Icon that moves with the line */}
          <div 
            ref={cameraWrapperRef}
            style={{ 
              position: 'absolute', 
              top: '0px', 
              left: '0%', 
              transform: 'translateX(-50%)', // Keeps the camera centered on the tip of the line
              zIndex: 10 
            }}
          >
            <WingedCamera />
          </div>

        </div>
        
        {/* Percentage with adjusted font styling */}
        <div 
          ref={textRef}
          className="font-serif"
          style={{
            marginTop: '1rem',
            color: '#fff',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            letterSpacing: '0.4em',
            textShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }}
        >
          0%
        </div>
      </div>

      {/* Flash Layer */}
      <div 
        ref={flashRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#fff',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default Loader;
