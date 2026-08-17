import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export const WhatsAppIcon = ({ size = 20, color = 'currentColor', className = '', style = {} }) => {
  return (
    <FontAwesomeIcon
      icon={faWhatsapp}
      className={className}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color: color,
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

export default WhatsAppIcon;
