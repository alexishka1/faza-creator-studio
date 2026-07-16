import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const TentangKami = () => {
  const textRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    // Text Reveal Animation
    const chars = textRef.current.querySelectorAll('.reveal-text');
    
    gsap.fromTo(chars, 
      { color: 'rgba(255, 255, 255, 0.2)' },
      {
        color: 'rgba(255, 255, 255, 1)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: true,
        }
      }
    );

    // Parallax Gallery
    const images = galleryRef.current.querySelectorAll('.gallery-item img');
    images.forEach((img, i) => {
      gsap.to(img, {
        yPercent: i % 2 === 0 ? 20 : -20,
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }, []);

  const philosophyText = "Fotografi bukan tentang kamera. Fotografi adalah tentang bagaimana kita melihat dunia. Melalui FAZA STUDIO, kami mengabadikan hal-hal yang sering tidak terlihat.";
  const words = philosophyText.split(" ");

  return (
    <PageTransition>
      <div style={{ paddingTop: '20vh', minHeight: '200vh', background: 'var(--color-bg)' }}>
        
        <div className="container" style={{ textAlign: 'center', marginBottom: '15rem', padding: '0 5%' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '5rem', letterSpacing: '0.1em' }}>TENTANG KAMI</h1>
          
          <div ref={textRef} style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {words.map((word, i) => (
              <span key={i} className="reveal-text font-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', fontWeight: 300, display: 'inline-block' }}>
                {word}
              </span>
            ))}
          </div>
        </div>

        <section className="section portfolio" style={{ paddingTop: 0 }}>
          <div className="container" ref={galleryRef}>
            <div className="gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4rem', padding: '0 5%' }}>
              {[
                '/images/foto_service1.jpg',
                '/images/foto_service2.jpg',
                '/images/foto_service3.jpg',
                '/images/foto_service4.jpg'
              ].map((src, i) => (
                <div key={i} className={`gallery-item`} style={{ gridColumn: i % 2 === 0 ? '2 / 6' : '7 / 11', marginTop: i % 2 !== 0 ? '10rem' : '0', overflow: 'hidden', height: '600px' }}>
                  <img src={src} alt={`Portfolio ${i + 1}`} style={{ width: '100%', height: '130%', objectFit: 'cover', transform: 'translateY(-15%)' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default TentangKami;
