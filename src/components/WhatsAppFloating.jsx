import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const WhatsAppFloating = () => {
  const [isHovered, setIsHovered] = useState(false);
  const waNumber = '6285933585829';
  const defaultMsg = 'Halo Faza Studio, saya mau tanya-tanya soal sewa studio dan paket foto';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <aside aria-label="WhatsApp Floating Widget" className="wa-float-container">
      {/* Tooltip / Popup Badge for Desktop */}
      <div
        className="wa-tooltip-desktop"
        style={{
          background: 'rgba(20, 17, 15, 0.95)',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          color: '#fff',
          padding: '0.55rem 1.1rem',
          borderRadius: '30px',
          fontSize: '0.82rem',
          fontWeight: 500,
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          opacity: isHovered ? 1 : 0.9,
          transform: isHovered ? 'translateX(0)' : 'translateX(4px)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            background: '#25D366',
            borderRadius: '50%',
            display: 'inline-block',
            boxShadow: '0 0 8px #25D366',
          }}
        />
        <span>Chat Admin (09.00–21.00)</span>
      </div>

      {/* Floating Button with Subtle Radar Pulse Ring */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        title="Chat via WhatsApp"
        className="wa-float-btn"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle Animation Pulse Ring */}
        <span className="wa-pulse-ring" />
        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '30px', color: '#fff' }} />
      </a>
    </aside>
  );
};

export default WhatsAppFloating;
