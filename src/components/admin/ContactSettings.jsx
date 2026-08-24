import React, { useState } from 'react';
import { STUDIO_INFO } from '../../data/contact';
import { Phone, MapPin, Clock, Mail, Camera, Check } from 'lucide-react';

const ContactSettings = () => {
  const [info] = useState(STUDIO_INFO);
  const [feedback, setFeedback] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setFeedback('Data kontak studio tersimpan di src/data/contact.js.');
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 0.5rem' }}>Pengaturan Kontak & Operasional Studio</h2>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
          Informasi ini terhubung secara otomatis ke seluruh navigasi, footer, tombol WhatsApp, dan form booking klien.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#120f0d',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem',
        }}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <label style={labelStyle}>
              <Phone size={14} color="var(--color-accent, #c9a96e)" />
              <span>Nomor WhatsApp Hotline Resmi</span>
            </label>
            <input
              type="text"
              readOnly
              value={info.phone}
              style={inputStyle}
            />
            <span style={hintStyle}>Format RAW: +{info.phoneRaw}</span>
          </div>

          <div>
            <label style={labelStyle}>
              <Clock size={14} color="var(--color-accent, #c9a96e)" />
              <span>Jam Operasional</span>
            </label>
            <input
              type="text"
              readOnly
              value={info.hours}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <MapPin size={14} color="var(--color-accent, #c9a96e)" />
              <span>Alamat Lengkap Studio (Ciracas, Jakarta Timur)</span>
            </label>
            <textarea
              rows={3}
              readOnly
              value={info.address}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>
                <Mail size={14} color="var(--color-accent, #c9a96e)" />
                <span>Email Resmi</span>
              </label>
              <input
                type="email"
                readOnly
                value={info.email}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Camera size={14} color="var(--color-accent, #c9a96e)" />
                <span>Instagram Handle</span>
              </label>
              <input
                type="text"
                readOnly
                value={info.instagram}
                style={inputStyle}
              />
            </div>
          </div>

          {feedback && (
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#4ade80' }}>
              ✅ {feedback}
            </p>
          )}

          <div style={{ padding: '1rem', backgroundColor: 'rgba(201, 169, 110, 0.1)', borderRadius: '8px', border: '1px solid rgba(201, 169, 110, 0.25)' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-accent, #c9a96e)', lineHeight: 1.5 }}>
              💡 <strong>Single Source of Truth:</strong> Data di atas tersinkronisasi 100% dari <code>src/data/contact.js</code> sehingga seluruh tombol WA di website memakai nomor yang sama.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.82rem',
  color: 'rgba(255, 255, 255, 0.8)',
  marginBottom: '0.4rem',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
};

const hintStyle = {
  display: 'block',
  fontSize: '0.72rem',
  color: 'rgba(255, 255, 255, 0.4)',
  marginTop: '0.3rem',
};

export default ContactSettings;
