import React, { useState } from 'react';
import { B2C_SERVICES, B2B_SERVICES } from '../../data/services';
import { Package, Tag, Check, AlertCircle } from 'lucide-react';

const ServiceManager = () => {
  const [b2c, setB2c] = useState(B2C_SERVICES);
  const [b2b, setB2b] = useState(B2B_SERVICES);
  const [feedback, setFeedback] = useState('');

  const toggleStatus = (type, id) => {
    if (type === 'b2c') {
      setB2c((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: item.status === 'Tersedia' ? 'Penuh / Sold Out' : 'Tersedia' }
            : item
        )
      );
    } else {
      setB2b((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: item.status === 'Tersedia' ? 'Penuh / Sold Out' : 'Tersedia' }
            : item
        )
      );
    }
    setFeedback('Status paket berhasil diperbarui.');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 0.5rem' }}>Manajemen Paket Layanan & Harga</h2>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
          Daftar paket aktif B2C Retail & B2B Creative Space studio. Anda dapat memantau status aktif dan ketersediaan tiap paket.
        </p>
        {feedback && (
          <p style={{ marginTop: '0.8rem', color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
            ✅ {feedback}
          </p>
        )}
      </div>

      {/* ── 1. B2C Retail Packages ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(201, 169, 110, 0.2)', color: 'var(--color-accent, #c9a96e)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Kategori 1
          </span>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>B2C Retail (Harga Terbuka & Reguler)</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {b2c.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#120f0d',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 600 }}>{item.title}</h4>
                  {item.tag && (
                    <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(201, 169, 110, 0.15)', color: 'var(--color-accent, #c9a96e)', fontWeight: 600 }}>
                      {item.tag}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1rem' }}>{item.subtitle}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80', margin: '0 0 1rem' }}>{item.price}</p>
                
                <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.2rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  {item.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: item.status === 'Penuh / Sold Out' ? '#f87171' : '#4ade80', fontWeight: 600 }}>
                  ● {item.status || 'Tersedia'}
                </span>
                <button
                  onClick={() => toggleStatus('b2c', item.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Toggle Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. B2B Creative Space ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Kategori 2
          </span>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>B2B Creative Space & Produksi Komersial</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {b2b.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#120f0d',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 600 }}>{item.title}</h4>
                  {item.tag && (
                    <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(201, 169, 110, 0.15)', color: 'var(--color-accent, #c9a96e)', fontWeight: 600 }}>
                      {item.tag}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1rem' }}>{item.subtitle}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent, #c9a96e)', margin: '0 0 1rem' }}>{item.price}</p>
                
                <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.2rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  {item.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: item.status === 'Penuh / Sold Out' ? '#f87171' : '#4ade80', fontWeight: 600 }}>
                  ● {item.status || 'Tersedia'}
                </span>
                <button
                  onClick={() => toggleStatus('b2b', item.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Toggle Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;
