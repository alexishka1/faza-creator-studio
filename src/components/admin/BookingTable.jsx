import React, { useState, useMemo } from 'react';
import { Search, CheckCircle, XCircle, Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const STATUS_CONFIG = {
  pending: {
    label: 'Menunggu Konfirmasi',
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.3)',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    bg: 'rgba(34, 197, 94, 0.15)',
    color: '#22c55e',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  cancelled: {
    label: 'Dibatalkan',
    bg: 'rgba(248, 113, 113, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(248, 113, 113, 0.3)',
  },
};

const BookingTable = ({ bookings = [], onUpdateStatus, actionLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        b.nama?.toLowerCase().includes(term) ||
        b.phone?.includes(term) ||
        b.email?.toLowerCase().includes(term) ||
        b.layanan?.toLowerCase().includes(term) ||
        b.tanggal?.includes(term);

      return matchStatus && matchSearch;
    });
  }, [bookings, statusFilter, searchTerm]);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Search & Filter Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Semua Reservasi' },
            { id: 'pending', label: 'Menunggu Konfirmasi' },
            { id: 'confirmed', label: 'Dikonfirmasi' },
            { id: 'cancelled', label: 'Dibatalkan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: statusFilter === tab.id ? '1px solid var(--color-accent, #c9a96e)' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: statusFilter === tab.id ? 'rgba(201, 169, 110, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: statusFilter === tab.id ? 'var(--color-accent, #c9a96e)' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.8rem',
                fontWeight: statusFilter === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '0.45rem 0.9rem',
            width: '280px',
          }}
        >
          <Search size={16} color="rgba(255, 255, 255, 0.4)" />
          <input
            type="text"
            placeholder="Cari nama, no WA, paket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontSize: '0.82rem',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Bookings Table / List */}
      {filteredBookings.length === 0 ? (
        <div
          style={{
            backgroundColor: '#120f0d',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <p style={{ fontSize: '1rem', margin: 0 }}>Tidak ada data reservasi yang cocok dengan filter.</p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#120f0d',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={thStyle}>Klien & Kontak</th>
                <th style={thStyle}>Paket Layanan</th>
                <th style={thStyle}>Jadwal Sesi</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const conf = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                return (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {/* Client Info */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{b.nama}</span>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>{b.phone}</span>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{b.email}</span>
                      </div>
                    </td>

                    {/* Package */}
                    <td style={tdStyle}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--color-accent, #c9a96e)', fontSize: '0.86rem' }}>
                          {b.layanan}
                        </span>
                        {b.pesan && b.pesan !== '-' && (
                          <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', maxWidth: '240px' }}>
                            <em>"{b.pesan}"</em>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>
                          <Calendar size={14} color="var(--color-accent, #c9a96e)" />
                          <span>{b.tanggal}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                          <Clock size={13} color="rgba(255,255,255,0.5)" />
                          <span>Pukul {b.jam} WIB</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: conf.bg,
                          color: conf.color,
                          border: conf.border,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {conf.label}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {/* Direct WhatsApp Chat */}
                        <a
                          href={`https://wa.me/${b.phone?.replace(/\D/g, '').replace(/^0/, '62')}?text=Halo%20${encodeURIComponent(b.nama)}%2C%20kami%20dari%20Faza%20Studio%20mengenai%20reservasi%20sesi%20${encodeURIComponent(b.layanan)}%20pada%20${b.tanggal}%20pukul%20${b.jam}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Hubungi Klien via WhatsApp"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '6px',
                            background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                            color: '#fff',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <FontAwesomeIcon icon={faWhatsapp} />
                          <span>Chat WA</span>
                        </a>

                        {/* Confirm Button */}
                        {b.status === 'pending' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'confirmed')}
                            disabled={actionLoading === b.id + 'confirmed'}
                            title="Konfirmasi Booking"
                            style={{
                              padding: '0.45rem 0.8rem',
                              backgroundColor: 'rgba(34, 197, 94, 0.15)',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              borderRadius: '6px',
                              color: '#22c55e',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            ✓ Konfirmasi
                          </button>
                        )}

                        {/* Cancel Button */}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Batalkan reservasi ${b.nama}? Slot waktu akan dibuka kembali.`)) {
                                onUpdateStatus(b.id, 'cancelled');
                              }
                            }}
                            disabled={actionLoading === b.id + 'cancelled'}
                            title="Batalkan Booking & Buka Slot"
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
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '1rem',
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'rgba(255, 255, 255, 0.5)',
  textAlign: 'left',
  fontWeight: 600,
};

const tdStyle = {
  padding: '1.1rem 1rem',
  verticalAlign: 'middle',
};

export default BookingTable;
