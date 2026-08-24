import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getWhatsAppUrl } from '../data/contact';

const WhatsAppFloating = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const waUrl = getWhatsAppUrl('Hello Faza Studio, I would like to inquire about studio rental and photoshoot packages.');

  if (location.pathname === '/admin') return null;

  return (
    <aside aria-label="WhatsApp Floating Widget" className="wa-float-container">
      {/* Tooltip / Popup Badge for Desktop */}
      <div
        className="wa-tooltip-desktop"
        style={{
          background: 'rgba(20, 17, 15, 0.95)',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '30px',
          fontSize: '0.78rem',
          fontWeight: 500,
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: isHovered ? 1 : 0.9,
          transform: isHovered ? 'translateX(0)' : 'translateX(4px)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            background: 'var(--color-wa, #20c850)',
            borderRadius: '50%',
            display: 'inline-block',
            boxShadow: '0 0 10px var(--color-wa-light, #2fe668)',
          }}
        />
        <span>Chat Studio Team (9AM–9PM)</span>
      </div>

      {/* Floating Button with Subtle Radar Pulse Ring */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Faza Studio via WhatsApp"
        title="Chat via WhatsApp"
        className="wa-float-btn"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle Animation Pulse Ring */}
        <span className="wa-pulse-ring" />
        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '28px', color: '#fff' }} />
      </a>
    </aside>
  );
};

export default WhatsAppFloating;
