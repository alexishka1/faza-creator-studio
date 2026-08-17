import React, { useState, useEffect, useCallback } from 'react';

const ADMIN_KEY = 'admin12345'; // Sementara — idealnya lewat env var

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Block date
  const [blockDate, setBlockDate] = useState('');
  const [blockJam, setBlockJam] = useState('');
  const [blockAlasan, setBlockAlasan] = useState('');
  const [blockMsg, setBlockMsg] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings${filter !== 'all' ? `?status=${filter}` : ''}`, {
        headers: { 'x-admin-key': ADMIN_KEY },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isLoggedIn) fetchBookings();
  }, [isLoggedIn, fetchBookings]);

  // Poll setiap 30 detik untuk realtime feel
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, fetchBookings]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Password salah. Coba lagi.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({ id, status }),
      });
      fetchBookings();
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    setBlockMsg('');
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({ tanggal: blockDate, jam: blockJam || null, alasan: blockAlasan }),
      });
      const data = await res.json();
      if (data.success) {
        setBlockMsg('✅ Tanggal/jam berhasil diblokir!');
        setBlockDate(''); setBlockJam(''); setBlockAlasan('');
      }
    } catch {
      setBlockMsg('❌ Gagal memblokir. Coba lagi.');
    }
  };

  // ===== LOGIN PAGE =====
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh', background: '#050505', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ width: '100%', maxWidth: '380px', padding: '0 2rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Faza Studio
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#fff', marginBottom: '2.5rem', fontWeight: 400 }}>
            Admin Dashboard
          </h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              placeholder="Password Admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', padding: '1rem', borderRadius: '6px',
                fontSize: '1rem', outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
              required
            />
            {loginError && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{loginError}</p>}
            <button type="submit" style={{
              padding: '1rem', background: '#fff', color: '#000', border: 'none',
              borderRadius: '6px', fontSize: '0.9rem', fontWeight: '600',
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em',
              fontFamily: 'Inter, sans-serif',
            }}>
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  const pending = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '0' }}>

      {/* Top Bar */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', margin: 0 }}>Faza Studio</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 400, margin: 0 }}>Admin Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={fetchBookings} style={smallBtnStyle}>Refresh</button>
          <button onClick={() => setIsLoggedIn(false)} style={{ ...smallBtnStyle, borderColor: 'rgba(248,113,113,0.4)', color: '#f87171' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Booking', value: bookings.length, color: '#fff' },
            { label: 'Menunggu Konfirmasi', value: pending, color: STATUS_COLORS.pending },
            { label: 'Dikonfirmasi', value: confirmed, color: STATUS_COLORS.confirmed },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>{stat.label}</p>
              <p style={{ fontSize: '2.5rem', fontFamily: 'Georgia, serif', color: stat.color, margin: 0, fontWeight: 400 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>

          {/* Bookings Table */}
          <div>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '0.4rem 1rem', borderRadius: '100px',
                  border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  background: filter === f ? '#fff' : 'transparent',
                  color: filter === f ? '#000' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {f === 'all' ? 'Semua' : STATUS_LABELS[f]}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem 0' }}>Memuat data...</p>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
                <p>Belum ada booking yang masuk.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bookings.map((b) => (
                  <div key={b.id} style={{
                    background: '#0a0a0a', border: `1px solid ${b.status === 'pending' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '8px', padding: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '1rem' }}>{b.nama}</span>
                          <span style={{
                            padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.7rem',
                            background: `${STATUS_COLORS[b.status]}22`,
                            color: STATUS_COLORS[b.status],
                            border: `1px solid ${STATUS_COLORS[b.status]}44`,
                          }}>
                            {STATUS_LABELS[b.status]}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                          {[
                            { icon: '📸', val: b.layanan },
                            { icon: '📅', val: b.tanggal },
                            { icon: '🕐', val: b.jam },
                            { icon: '📧', val: b.email },
                            { icon: '📱', val: b.phone },
                          ].map(({ icon, val }) => (
                            <p key={val} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                              {icon} {val}
                            </p>
                          ))}
                        </div>
                        {b.pesan && (
                          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', margin: '0.75rem 0 0', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                            "{b.pesan}"
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {b.status === 'pending' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                            disabled={actionLoading === b.id + 'confirmed'}
                            style={{ ...actionBtnStyle, background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.3)', color: '#4ade80' }}
                          >
                            {actionLoading === b.id + 'confirmed' ? '...' : '✅ Konfirmasi'}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                            disabled={actionLoading === b.id + 'cancelled'}
                            style={{ ...actionBtnStyle, background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)', color: '#f87171' }}
                          >
                            {actionLoading === b.id + 'cancelled' ? '...' : '❌ Tolak'}
                          </button>
                          <a
                            href={`https://wa.me/${b.phone?.replace(/\D/g, '').replace(/^0/, '62')}?text=Halo%20${encodeURIComponent(b.nama)}%2C%20booking%20Anda%20untuk%20sesi%20${encodeURIComponent(b.layanan)}%20pada%20${b.tanggal}%20pukul%20${b.jam}%20telah%20dikonfirmasi!%20Sampai%20jumpa%20di%20studio%20kami%20%F0%9F%93%B8`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ ...actionBtnStyle, textDecoration: 'none', display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                          >
                            💬 WA Klien
                          </a>
                        </div>
                      )}

                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', margin: '0.75rem 0 0', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                      ID: {b.id} · Masuk: {new Date(b.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Block Date Panel */}
          <div style={{ minWidth: '280px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.5rem', fontWeight: 400 }}>
              🔒 Blokir Tanggal / Jam
            </h3>
            <form onSubmit={handleBlockDate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Tanggal</label>
                <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} required style={formInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Jam (kosongkan = blokir seharian)</label>
                <select value={blockJam} onChange={e => setBlockJam(e.target.value)} style={formInputStyle}>
                  <option value="">— Seharian —</option>
                  {['09:00', '11:00', '13:00', '15:00', '17:00'].map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Alasan (opsional)</label>
                <input type="text" placeholder="Libur studio, event, dll." value={blockAlasan} onChange={e => setBlockAlasan(e.target.value)} style={formInputStyle} />
              </div>
              <button type="submit" style={{ ...actionBtnStyle, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.75rem' }}>
                Blokir
              </button>
              {blockMsg && <p style={{ fontSize: '0.82rem', color: blockMsg.startsWith('✅') ? '#4ade80' : '#f87171', margin: 0 }}>{blockMsg}</p>}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

const smallBtnStyle = {
  padding: '0.4rem 0.8rem', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)',
  borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
};

const actionBtnStyle = {
  padding: '0.6rem 1rem', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
  borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  transition: 'all 0.2s ease',
};

const labelStyle = {
  display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem',
};

const formInputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '6px',
  fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif',
};

export default Admin;
