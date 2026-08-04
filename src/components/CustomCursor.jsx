import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      // Move dot instantly
      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });

      // Move ring with a slight delay/trail
      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const updateHoverState = (e) => {
      const target = e.target;
      // Check if hovering over clickable elements
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.team-card') ||
        target.closest('.gallery-item') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      if (isClickable !== isHovering) {
        setIsHovering(isClickable);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, [isHovering]);

  useEffect(() => {
    if (isHovering) {
      // Expand ring, shrink/hide dot
      gsap.to(ringRef.current, { scale: 1.5, borderColor: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.1)', duration: 0.3 });
      gsap.to(dotRef.current, { scale: 0, duration: 0.3 });
    } else {
      // Normal state
      gsap.to(ringRef.current, { scale: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'transparent', duration: 0.3 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999999, // Ensure it's always on top
          mixBlendMode: 'difference'
        }}
      />
      <div 
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999999, // Ensure it's always on top
          mixBlendMode: 'difference'
        }}
      />
    </>
  );
};

export default CustomCursor;
