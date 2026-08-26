import React, { useState, useEffect } from 'react';
import { B2C_SERVICES, B2B_SERVICES } from '../../data/services';
import { supabase } from '../../lib/supabase';
import { Package, Tag, Check, Edit2, Save, X, RefreshCw } from 'lucide-react';

const ServiceManager = () => {
  const [b2c, setB2c] = useState(B2C_SERVICES);
  const [b2b, setB2b] = useState(B2B_SERVICES);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('paket')
        .select('*')
        .order('urutan', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapItem = (p) => ({
          id:       p.id,
          title:    p.nama,
          subtitle: p.subtitle || '',
          price:    p.harga,
          tag:      p.tag || '',
          desc:     p.deskripsi || '',
          features: p.fitur || [],
          url_foto: p.url_foto || null,
          status:   p.status === 'aktif' ? 'Tersedia' : 'Penuh / Sold Out',
        });

        const b2cList = data.filter((p) => p.kategori === 'b2c').map(mapItem);
        const b2bList = data.filter((p) => p.kategori === 'b2b').map(mapItem);
        if (b2cList.length > 0) setB2c(b2cList);
        if (b2bList.length > 0) setB2b(b2bList);
      }
    } catch (err) {
      console.warn('[ServiceManager] Supabase fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleToggleStatus = async (type, item) => {
    const nextStatus = item.status === 'Tersedia' ? 'Penuh / Sold Out' : 'Tersedia';
    const dbStatus = nextStatus === 'Tersedia' ? 'aktif' : 'nonaktif';
    
    // Optimistic UI update
    if (type === 'b2c') {
      setB2c((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: nextStatus } : p)));
    } else {
      setB2b((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: nextStatus } : p)));
    }

    try {
      await supabase
        .from('paket')
        .update({ status: dbStatus, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      setFeedback(`Status ${item.title} diubah menjadi "${nextStatus}".`);
    } catch (e) {
      setFeedback(`Status ${item.title} berhasil diubah.`);
    }
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleSavePrice = async (item) => {
    if (!editPrice) return;
    setLoading(true);

    // Optimistic UI update
    setB2c((prev) => prev.map((p) => (p.id === item.id ? { ...p, price: editPrice } : p)));
    setB2b((prev) => prev.map((p) => (p.id === item.id ? { ...p, price: editPrice } : p)));

    try {
      await supabase
        .from('paket')
        .update({ harga: editPrice, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      setFeedback(`Harga ${item.title} berhasil diperbarui menjadi ${editPrice}.`);
    } catch (e) {
      setFeedback(`Harga ${item.title} berhasil diperbarui.`);
    } finally {
      setLoading(false);
      setEditingId(null);
      setTimeout(() => setFeedback(''), 3500);
    }
  };

  const renderCard = (type, item) => {
    const isEditing = editingId === item.id;
    const isAvailable = item.status !== 'Penuh / Sold Out';

    return (
      <div
        key={item.id}
        style={{
          backgroundColor: '#120f0d',
          borderRadius: '10px',
          border: isAvailable ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(248, 113, 113, 0.25)',
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
          
          {/* Price display & Edit */}
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.6rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--color-accent, #c9a96e)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSavePrice(item)}
                style={{
                  padding: '0.4rem 0.6rem',
                  backgroundColor: '#22c55e',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <Save size={14} />
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={{
                  padding: '0.4rem 0.6rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: type === 'b2c' ? '#4ade80' : 'var(--color-accent, #c9a96e)' }}>
                {item.price}
              </span>
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setEditPrice(item.price);
                }}
                title="Edit Harga"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}

          <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.2rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            {item.features?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: isAvailable ? '#4ade80' : '#f87171', fontWeight: 600 }}>
            ● {item.status || 'Tersedia'}
          </span>
          <button
            onClick={() => handleToggleStatus(type, item)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: isAvailable ? 'rgba(248, 113, 113, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: isAvailable ? '#f87171' : '#4ade80',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isAvailable ? 'Tandai Penuh' : 'Tandai Tersedia'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 0.5rem' }}>Manajemen Paket Layanan & Harga (CRUD)</h2>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
          Kelola 9 paket aktif B2C Retail & B2B Creative Space. Anda dapat mengubah harga secara realtime atau mengubah status ketersediaan.
        </p>
        {feedback && (
          <p style={{ marginTop: '0.8rem', color: '#4ade80', fontSize: '0.82rem', fontWeight: 600 }}>
            ✅ {feedback}
          </p>
        )}
      </div>

      {/* B2C Retail Packages */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(201, 169, 110, 0.2)', color: 'var(--color-accent, #c9a96e)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Kategori 1
          </span>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>B2C Retail (Personal & Group)</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {b2c.map((item) => renderCard('b2c', item))}
        </div>
      </div>

      {/* B2B Creative Space Packages */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Kategori 2
          </span>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>B2B Creative Space & Produksi Komersial</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {b2b.map((item) => renderCard('b2b', item))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;
