import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop', // Studio lights
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop', // Vintage camera
  'https://images.unsplash.com/photo-1551316671-12ecdbb19ba9?q=80&w=800&auto=format&fit=crop', // Photography equipment
  'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?q=80&w=800&auto=format&fit=crop', // Studio shoot
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop', // Camera lens
  'https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?q=80&w=800&auto=format&fit=crop', // Fashion shoot
  'https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=800&auto=format&fit=crop', // Aesthetic room
  'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800&auto=format&fit=crop', // Professional camera set
];

const SERVICES = [
  {
    title: 'Portrait Session',
    price: 'Mulai dari Rp 1.500.000',
    desc: 'Sesi foto personal atau profesional dengan pencahayaan studio premium dan arahan gaya eksklusif.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Pre-Wedding',
    price: 'Mulai dari Rp 3.500.000',
    desc: 'Konsep cerita cinta yang diabadikan dengan indah melalui konsep artistik dan sinematik.',
    img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Editorial & Fashion',
    price: 'Mulai dari Rp 5.000.000',
    desc: 'Pemotretan komersial berstandar majalah internasional untuk kebutuhan portfolio atau brand Anda.',
    img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Product & Commercial',
    price: 'Mulai dari Rp 2.000.000',
    desc: 'Katalog produk berkualitas tinggi dengan detail sempurna untuk kebutuhan iklan dan visual.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
  }
];

const Layanan = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const marqueeRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pin the header section while scrolling the cards
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: headerRef.current,
        pinSpacing: false,
      });

      // Infinite horizontal scrolling background
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1
        });
      }

      // Staggered slide up for all service cards together
      gsap.fromTo(".service-arch-card", 
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-container",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', minHeight: '200vh', background: 'var(--color-bg)' }}>
        
        <div ref={headerRef} style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}>
          
          {/* Animated Background Gallery */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: 0.7 }}>
            <div ref={marqueeRef} style={{ display: 'flex', gap: '2vw', whiteSpace: 'nowrap', padding: '0 1vw', willChange: 'transform' }}>
              {/* Duplicate array for seamless looping */}
              {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
                <div key={i} style={{ width: '25vw', minWidth: '300px', height: '40vh', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) contrast(1.1)' }} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Overlay to ensure text readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)' }} />

          {/* Foreground Text */}
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.1em', color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,0.9)' }}>LAYANAN KAMI</h1>
            <p style={{ marginTop: '2rem', fontSize: '1.2rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textShadow: '0 5px 15px rgba(0,0,0,0.9)' }}>Tailored experiences for your unique story.</p>
          </div>
        </div>

        <div style={{ marginTop: '100vh', zIndex: 1, position: 'relative', background: 'var(--color-bg)', padding: '5rem 0 10rem 0' }}>
          <div className="container">
            
            <div className="services-container">
              {SERVICES.map((service, i) => (
                <div 
                  key={i}
                  ref={el => cardsRef.current[i] = el}
                  className="service-arch-card"
                >
                  <img src={service.img} alt={service.title} className="service-arch-card-bg" />
                  <div className="service-arch-card-content">
                    <h3 className="service-arch-card-title">{service.title}</h3>
                    <div className="service-arch-card-price">{service.price}</div>
                    <p className="service-arch-card-desc">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Layanan;
