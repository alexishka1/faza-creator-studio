import React from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Lock,
  Star,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { GOOGLE_REVIEWS_STATS } from '../../data/testimonials';

const AdminOverview = ({ stats, bookings = [], setActiveTab, onUpdateStatus }) => {
  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  const statCards = [
    {
      label: 'Menunggu Konfirmasi',
      value: stats.pending || 0,
      icon: Clock,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      desc: 'Butuh verifikasi admin',
      actionTab: 'bookings',
    },
    {
      label: 'Jadwal Terkonfirmasi',
      value: stats.confirmed || 0,
      icon: CheckCircle2,
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.12)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      desc: 'Sesi foto aktif & fix',
      actionTab: 'occupancy',
    },
    {
      label: 'Slot Jadwal Terkunci',
      value: stats.blocked || 0,
      icon: Lock,
      color: '#f87171',
      bg: 'rgba(248, 113, 113, 0.12)',
      border: '1px solid rgba(248, 113, 113, 0.3)',
      desc: 'Maintenance / Libur',
      actionTab: 'blocked',
    },
    {
      label: 'Rating Google Studio',
      value: `${GOOGLE_REVIEWS_STATS.rating} ★`,
      icon: Star,
      color: 'var(--color-accent, #c9a96e)',
      bg: 'rgba(201, 169, 110, 0.12)',
      border: '1px solid rgba(201, 169, 110, 0.3)',
      desc: `${GOOGLE_REVIEWS_STATS.count}+ Ulasan Klien`,
      actionTab: 'overview',
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* ── 1. KPI Stats Cards Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.2rem',
          marginBottom: '2.5rem',
        }}
      >
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => card.actionTab && setActiveTab(card.actionTab)}
              style={{
                backgroundColor: '#120f0d',
                border: card.border,
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.label}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={card.color} />
                </div>
              </div>
              <p style={{ margin: '0 0 0.4rem', fontSize: '2rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                {card.value}
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── 2. Quick Action Banner: Peta Okupansi Mingguan ── */}
      <div
        style={{
          backgroundColor: '#181412',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          borderRadius: '12px',
          padding: '1.6rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.2rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-accent, #c9a96e)', fontWeight: 700 }}>
            Fitur Utama Monitoring
          </span>
          <h3 style={{ margin: '0.3rem 0 0.4rem', fontSize: '1.2rem', color: '#fff' }}>
            Peta Okupansi Mingguan (Interactive Weekly Grid)
          </h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', maxWidth: '560px' }}>
            Pantau ketersediaan seluruh slot studio Senin–Minggu secara realtime. Slot yang dibooking user otomatis terkunci secara visual untuk mencegah bentrok jadwal.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('occupancy')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.8rem 1.4rem',
            backgroundColor: 'var(--color-accent, #c9a96e)',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
          }}
        >
          <span>Buka Peta Okupansi</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── 3. Recent Pending Bookings ── */}
      <div
        style={{
          backgroundColor: '#120f0d',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>
            Reservasi Baru yang Menunggu Verifikasi ({pendingBookings.length})
          </h3>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{ background: 'none', border: 'none', color: 'var(--color-accent, #c9a96e)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Lihat Semua →
          </button>
        </div>

        {pendingBookings.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', padding: '2rem 0' }}>
            Tidak ada reservasi pending saat ini. Semua jadwal telah terverifikasi!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {pendingBookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '1rem 1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{b.nama}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>· {b.phone}</span>
                  </div>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--color-accent, #c9a96e)' }}>
                    {b.layanan} — {b.tanggal} pukul {b.jam} WIB
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onUpdateStatus(b.id, 'confirmed')}
                    style={{
                      padding: '0.45rem 0.9rem',
                      backgroundColor: '#22c55e',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Konfirmasi
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Tolak dan batalkan booking ini?')) {
                        onUpdateStatus(b.id, 'cancelled');
                      }
                    }}
                    style={{
                      padding: '0.45rem 0.8rem',
                      backgroundColor: 'rgba(248, 113, 113, 0.15)',
                      border: '1px solid rgba(248, 113, 113, 0.3)',
                      borderRadius: '6px',
                      color: '#f87171',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ✕ Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
