import React, { useState } from 'react';
import { Lock, Unlock, Calendar, Clock, AlertCircle } from 'lucide-react';

const SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

const BlockedSlotManager = ({ blockedSlots = [], onBlockSlot, onUnblockSlot, actionLoading }) => {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [alasan, setAlasan] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tanggal) return;
    setIsSubmitting(true);
    setFeedback('');

    const res = await onBlockSlot(tanggal, jam, alasan);
    setIsSubmitting(false);

    if (res.success) {
      setFeedback('✅ Jadwal berhasil diblokir.');
      setTanggal('');
      setJam('');
      setAlasan('');
      setTimeout(() => setFeedback(''), 4000);
    } else {
      setFeedback(`❌ Gagal: ${res.error || 'Terjadi kesalahan'}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Form Tambah Blokir */}
        <div
          style={{
            backgroundColor: '#120f0d',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
            <Lock size={18} color="#f87171" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Kunci Tanggal / Jam Studio</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Gunakan form ini untuk menutup ketersediaan studio jika ada maintenance, libur operasional, atau sewa offline mendadak.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={labelStyle}>Tanggal yang Ditutup *</label>
              <input
                type="date"
                required
                value={tanggal}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTanggal(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Sesi Jam (Kosongkan jika tutup seharian)</label>
              <select value={jam} onChange={(e) => setJam(e.target.value)} style={inputStyle}>
                <option value="">Semua Jam (Tutup 1 Hari Penuh)</option>
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    Pukul {s} WIB Saja
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Keterangan / Alasan (Opsional)</label>
              <input
                type="text"
                placeholder="Misal: Studio Maintenance / Libur Nasional"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                style={inputStyle}
              />
            </div>

            {feedback && (
              <p style={{ fontSize: '0.85rem', color: feedback.startsWith('✅') ? '#4ade80' : '#f87171', margin: 0 }}>
                {feedback}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.85rem',
                backgroundColor: '#f87171',
                color: '#fff',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
              }}
            >
              <Lock size={16} />
              <span>{isSubmitting ? 'Memproses...' : 'Kunci Jadwal Ini'}</span>
            </button>
          </form>
        </div>

        {/* Daftar Blokir Aktif */}
        <div
          style={{
            backgroundColor: '#120f0d',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Daftar Slot Terblokir Aktif</h3>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', padding: '0.2rem 0.6rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              {blockedSlots.length} Terkunci
            </span>
          </div>

          {blockedSlots.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem 0' }}>
              Tidak ada tanggal atau jam yang sedang diblokir. Semua slot normal.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '420px', overflowY: 'auto' }}>
              {blockedSlots.map((b) => (
                <div
                  key={b.id}
                  style={{
                    backgroundColor: 'rgba(248, 113, 113, 0.05)',
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                    borderRadius: '8px',
                    padding: '0.9rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>
                      <Calendar size={14} color="#f87171" />
                      <span>{b.tanggal}</span>
                      <span style={{ fontSize: '0.75rem', color: b.jam ? '#f59e0b' : '#f87171', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                        {b.jam ? `Pukul ${b.jam} WIB` : '1 HARI PENUH'}
                      </span>
                    </div>
                    {b.alasan && (
                      <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        Keterangan: {b.alasan}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Buka blokir untuk ${b.tanggal} (${b.jam || 'Seharian'})?`)) {
                        onUnblockSlot(b.id);
                      }
                    }}
                    disabled={actionLoading === b.id + 'unblock'}
                    title="Buka Blokir (Hapus)"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <Unlock size={12} />
                    <span>Buka Blokir</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  color: 'rgba(255, 255, 255, 0.7)',
  marginBottom: '0.4rem',
  fontWeight: 500,
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
};

export default BlockedSlotManager;
