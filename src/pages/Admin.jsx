import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const ALL_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#4ade80',
  cancelled: '#f87171',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Dikonfirmasi',
  cancelled: 'Ditolak',
};

const Admin = () => {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('faza_admin_key') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0, blocked: 0 });
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'blocked'
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Block date inputs
  const [blockDate, setBlockDate] = useState('');
  const [blockJam, setBlockJam] = useState('');
  const [blockAlasan, setBlockAlasan] = useState('');
  const [blockMsg, setBlockMsg] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  const fetchBookings = useCallback(async (keyToUse = adminKey) => {
    if (!keyToUse) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings${filter !== 'all' ? `?status=${filter}` : ''}`, {
        headers: { 'x-admin-key': keyToUse },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setBlockedSlots(data.blockedSlots || []);
        if (data.stats) setStats(data.stats);
        setIsLoggedIn(true);
      } else {
        if (res.status === 401) {
          setIsLoggedIn(false);
          sessionStorage.removeItem('faza_admin_key');
        }
      }
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  }, [adminKey, filter]);

  // Initial check on mount if key in sessionStorage
  useEffect(() => {
    const savedKey = sessionStorage.getItem('faza_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchBookings(savedKey);
    }
  }, [fetchBookings]);

  // Polling every 30s for live updates
  useEffect(() => {
    if (!isLoggedIn || !adminKey) return;
    const interval = setInterval(() => fetchBookings(adminKey), 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, adminKey, fetchBookings]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return;
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/bookings', {
        headers: { 'x-admin-key': password },
      });
      const data = await res.json();

      if (res.ok) {
        setAdminKey(password);
        sessionStorage.setItem('faza_admin_key', password);
        setIsLoggedIn(true);
        setBookings(data.bookings || []);
        setBlockedSlots(data.blockedSlots || []);
        if (data.stats) setStats(data.stats);
      } else {
        setLoginError(data.error || 'Password admin salah. Silakan coba lagi.');
      }
    } catch {
      setLoginError('Koneksi ke server gagal. Periksa jaringan Anda.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminKey('');
    setPassword('');
    sessionStorage.removeItem('faza_admin_key');
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchBookings(adminKey);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    setBlockMsg('');
    setIsBlocking(true);

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ tanggal: blockDate, jam: blockJam || null, alasan: blockAlasan }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBlockMsg('✅ Tanggal/jam berhasil diblokir!');
        setBlockDate('');
        setBlockJam('');
        setBlockAlasan('');
        fetchBookings(adminKey);
      } else {
        setBlockMsg(`❌ ${data.error || 'Gagal memblokir.'}`);
      }
    } catch {
      setBlockMsg('❌ Gagal memblokir. Coba lagi.');
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm('Yakin ingin membuka blokir slot ini?')) return;
    setActionLoading(`unblock-${id}`);

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchBookings(adminKey);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // ===== LOGIN VIEW =====
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh', background: '#050505', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ width: '100%', maxWidth: '380px', padding: '0 2rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'var(--color-accent, #c9a96e)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
            FAZA STUDIO
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#fff', marginBottom: '2.5rem', fontWeight: 400 }}>
            Admin Dashboard
          </h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              placeholder="Masukkan Password Admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', padding: '1rem', borderRadius: '6px',
                fontSize: '1rem', outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
              required
            />
            {loginError && <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{loginError}</p>}
            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                padding: '1rem', background: 'var(--color-accent, #c9a96e)', color: '#000', border: 'none',
                borderRadius: '6px', fontSize: '0.9rem', fontWeight: '600',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
              }}
            >
              {isLoggingIn ? 'Memverifikasi...' : 'Masuk Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD VIEW =====
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '0' }}>

      {/* Top Header Bar */}
      <header style={{ background: '#0a0807', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--color-accent, #c9a96e)', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>FAZA STUDIO</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, margin: 0, color: '#fff' }}>Admin Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button onClick={() => fetchBookings(adminKey)} style={smallBtnStyle}>🔄 Refresh</button>
          <button onClick={handleLogout} style={{ ...smallBtnStyle, borderColor: 'rgba(248,113,113,0.4)', color: '#f87171' }}>🚪 Logout</button>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Reservasi', value: stats.total, color: '#fff' },
            { label: 'Menunggu Konfirmasi', value: stats.pending, color: STATUS_COLORS.pending },
            { label: 'Dikonfirmasi', value: stats.confirmed, color: STATUS_COLORS.confirmed },
            { label: 'Ditolak / Batal', value: stats.cancelled, color: STATUS_COLORS.cancelled },
            { label: 'Jadwal Terblokir', value: stats.blocked, color: '#93c5fd' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#0e0c0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1.4rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.4rem', fontWeight: 500 }}>{stat.label}</p>
              <p style={{ fontSize: '2.2rem', fontFamily: 'Georgia, serif', color: stat.color, margin: 0, fontWeight: 400 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Mode Switch Tabs (Bookings vs Blocked Management) */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'bookings' ? 'var(--color-accent, #c9a96e)' : 'rgba(255,255,255,0.5)',
              borderBottom: activeTab === 'bookings' ? '2px solid var(--color-accent, #c9a96e)' : '2px solid transparent',
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📋 Daftar Booking Masuk ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'blocked' ? 'var(--color-accent, #c9a96e)' : 'rgba(255,255,255,0.5)',
              borderBottom: activeTab === 'blocked' ? '2px solid var(--color-accent, #c9a96e)' : '2px solid transparent',
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔒 Manajemen Blokir Jadwal ({blockedSlots.length})
          </button>
        </div>

        {activeTab === 'bookings' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* Bookings List */}
            <div>
              {/* Filter Sub-Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '0.45rem 1.1rem', borderRadius: '100px',
                    border: filter === f ? '1px solid var(--color-accent, #c9a96e)' : '1px solid rgba(255,255,255,0.1)',
                    background: filter === f ? 'var(--color-accent, #c9a96e)' : 'transparent',
                    color: filter === f ? '#000' : 'rgba(255,255,255,0.7)',
                    fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                  }}>
                    {f === 'all' ? 'Semua Status' : STATUS_LABELS[f]}
                  </button>
                ))}
              </div>

              {loading ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem 0' }}>Memuat data booking...</p>
              ) : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', background: '#0e0c0a', borderRadius: '8px' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
                  <p>Tidak ada reservasi ditemukan untuk filter ini.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {bookings.map((b) => (
                    <div key={b.id} style={{
                      background: '#0e0c0a', border: `1px solid ${b.status === 'pending' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '8px', padding: '1.5rem',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem' }}>

                        {/* Info Client */}
                        <div style={{ flex: 1, minWidth: '280px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>{b.nama}</span>
                            <span style={{
                              padding: '0.25rem 0.8rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600,
                              background: `${STATUS_COLORS[b.status]}22`,
                              color: STATUS_COLORS[b.status],
                              border: `1px solid ${STATUS_COLORS[b.status]}44`,
                            }}>
                              {STATUS_LABELS[b.status]}
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
                            {[
                              { icon: '📸', label: 'Paket', val: b.layanan },
                              { icon: '📅', label: 'Tanggal', val: b.tanggal },
                              { icon: '🕐', label: 'Jam Sesi', val: b.jam },
                              { icon: '📧', label: 'Email', val: b.email },
                              { icon: '📱', label: 'Telepon', val: b.phone },
                            ].map(({ icon, label, val }) => (
                              <div key={label} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', display: 'block' }}>{label}</span>
                                <span>{icon} {val}</span>
                              </div>
                            ))}
                          </div>
                          {b.pesan && (
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', margin: '0.9rem 0 0', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                              "{b.pesan}"
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                disabled={actionLoading === b.id + 'confirmed'}
                                style={{ ...actionBtnStyle, background: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.4)', color: '#4ade80', fontWeight: 600 }}
                              >
                                {actionLoading === b.id + 'confirmed' ? 'Memproses...' : '✅ Konfirmasi'}
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                disabled={actionLoading === b.id + 'cancelled'}
                                style={{ ...actionBtnStyle, background: 'rgba(248,113,113,0.12)', borderColor: 'rgba(248,113,113,0.4)', color: '#f87171', fontWeight: 600 }}
                              >
                                {actionLoading === b.id + 'cancelled' ? 'Memproses...' : '❌ Tolak'}
                              </button>
                            </>
                          )}
                          <a
                            href={`https://wa.me/${b.phone?.replace(/\D/g, '').replace(/^0/, '62')}?text=Halo%20${encodeURIComponent(b.nama)}%2C%20kami%20dari%20Faza%20Studio%20mengenai%20reservasi%20sesi%20${encodeURIComponent(b.layanan)}%20pada%20${b.tanggal}%20pukul%20${b.jam}.`}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                              background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                              color: '#fff',
                              fontWeight: 600,
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              boxShadow: '0 4px 15px var(--color-wa-glow, rgba(36, 215, 87, 0.45))',
                            }}
                          >
                            <FontAwesomeIcon icon={faWhatsapp} /> Chat Klien
                          </a>
                        </div>

                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', margin: '0.9rem 0 0', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.6rem' }}>
                        ID: {b.id} · Dibuat: {new Date(b.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Blocked Slots Management View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* Form Tambah Blokir */}
            <div style={{ background: '#0e0c0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-accent, #c9a96e)', margin: '0 0 1.5rem', fontWeight: 600 }}>
                🔒 Tambah Blokir Tanggal / Jam
              </h3>
              <form onSubmit={handleBlockDate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Tanggal yang Ingin Diblokir</label>
                  <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} required style={formInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Pilih Jam Sesi (Kosongkan jika blokir seharian)</label>
                  <select value={blockJam} onChange={e => setBlockJam(e.target.value)} style={formInputStyle}>
                    <option value="">— Blokir Seharian Penuh —</option>
                    {ALL_SLOTS.map(j => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Alasan / Keterangan (Opsional)</label>
                  <input type="text" placeholder="Contoh: Maintenance studio, Hari Libur, Private Shooting" value={blockAlasan} onChange={e => setBlockAlasan(e.target.value)} style={formInputStyle} />
                </div>
                <button
                  type="submit"
                  disabled={isBlocking}
                  style={{
                    ...actionBtnStyle,
                    background: 'var(--color-accent, #c9a96e)',
                    color: '#000',
                    fontWeight: 600,
                    border: 'none',
                    padding: '0.85rem',
                    cursor: isBlocking ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isBlocking ? 'Menyimpan...' : 'Simpan Blokir'}
                </button>
                {blockMsg && <p style={{ fontSize: '0.85rem', color: blockMsg.startsWith('✅') ? '#4ade80' : '#f87171', margin: 0 }}>{blockMsg}</p>}
              </form>
            </div>

            {/* List Tanggal Terblokir */}
            <div style={{ background: '#0e0c0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff', margin: '0 0 1.5rem', fontWeight: 600 }}>
                📅 Daftar Jadwal yang Sedang Diblokir
              </h3>
              {blockedSlots.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Belum ada tanggal atau slot jam yang diblokir.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {blockedSlots.map((b) => (
                    <div key={b.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px', padding: '0.9rem 1.2rem',
                    }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                          📅 {b.tanggal} — <span style={{ color: 'var(--color-accent, #c9a96e)' }}>{b.jam ? `Jam ${b.jam}` : 'Seharian Penuh'}</span>
                        </p>
                        {b.alasan && <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>Ket: {b.alasan}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnblock(b.id)}
                        disabled={actionLoading === `unblock-${b.id}`}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: 'rgba(248,113,113,0.1)',
                          border: '1px solid rgba(248,113,113,0.3)',
                          color: '#f87171',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {actionLoading === `unblock-${b.id}` ? '...' : 'Buka Blokir'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

const smallBtnStyle = {
  padding: '0.45rem 0.9rem', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)',
  borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
};

const actionBtnStyle = {
  padding: '0.6rem 1rem', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
  borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  transition: 'all 0.2s ease',
};

const labelStyle = {
  display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontWeight: 600,
};

const formInputStyle = {
  width: '100%', background: '#14110f', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', padding: '0.7rem 0.9rem', borderRadius: '6px',
  fontSize: '0.88rem', outline: 'none', fontFamily: 'Inter, sans-serif',
};

export default Admin;
