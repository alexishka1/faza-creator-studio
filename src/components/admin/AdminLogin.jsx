import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLogin = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('supabase'); // 'supabase' | 'pin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authErr) {
        // If Supabase auth user not found yet or error, try checking master password fallback
        if (password === 'admin12345') {
          sessionStorage.setItem('faza_admin_key', 'admin12345');
          sessionStorage.setItem('faza_admin_email', email || 'master-admin@fazastudio.com');
          onLoginSuccess({ email: email || 'master-admin@fazastudio.com', token: null, key: 'admin12345' });
          return;
        }
        setError(authErr.message || 'Email atau password salah.');
      } else if (data.session) {
        const token = data.session.access_token;
        sessionStorage.setItem('faza_admin_token', token);
        sessionStorage.setItem('faza_admin_email', data.user.email);
        onLoginSuccess({ email: data.user.email, token, key: null });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kendala jaringan saat autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async (e) => {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/bookings', {
        headers: { 'x-admin-key': pin },
      });

      if (res.ok) {
        sessionStorage.setItem('faza_admin_key', pin);
        sessionStorage.setItem('faza_admin_email', 'staf-studio@fazastudio.com');
        onLoginSuccess({ email: 'staf-studio@fazastudio.com', token: null, key: pin });
      } else {
        setError('PIN / Password Master studio salah.');
      }
    } catch (err) {
      console.error('PIN Login error:', err);
      setError('Koneksi ke server gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-login"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0807',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#14100e',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'rgba(201, 169, 110, 0.15)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem',
            }}
          >
            <ShieldCheck size={28} color="var(--color-accent, #c9a96e)" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", serif)',
              fontSize: '1.6rem',
              color: '#fff',
              margin: '0 0 0.4rem',
            }}
          >
            Faza Studio Portal
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
            Sistem Autentikasi Terenkripsi Supabase Auth
          </p>
        </div>

        {/* Mode Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '8px',
            padding: '0.3rem',
            marginBottom: '1.8rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('supabase');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: mode === 'supabase' ? 'var(--color-accent, #c9a96e)' : 'transparent',
              color: mode === 'supabase' ? '#000' : 'rgba(255, 255, 255, 0.65)',
              transition: 'all 0.2s ease',
            }}
          >
            Email & Password (Auth)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('pin');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: mode === 'pin' ? 'var(--color-accent, #c9a96e)' : 'transparent',
              color: mode === 'pin' ? '#000' : 'rgba(255, 255, 255, 0.65)',
              transition: 'all 0.2s ease',
            }}
          >
            Master PIN Studio
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(248, 113, 113, 0.15)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              color: '#f87171',
              fontSize: '0.8rem',
              marginBottom: '1.4rem',
            }}
          >
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Supabase Auth */}
        {mode === 'supabase' ? (
          <form onSubmit={handleSupabaseLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={labelStyle}>
                <Mail size={14} color="rgba(255,255,255,0.6)" />
                <span>Alamat Email Terdaftar</span>
              </label>
              <input
                type="email"
                required
                placeholder="admin@fazastudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                <Lock size={14} color="rgba(255,255,255,0.6)" />
                <span>Kata Sandi (Password)</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--color-accent, #c9a96e)',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
              }}
            >
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handlePinLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={labelStyle}>
                <KeyRound size={14} color="rgba(255,255,255,0.6)" />
                <span>Master PIN / Password Studio</span>
              </label>
              <input
                type="password"
                required
                placeholder="Masukkan PIN Studio"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--color-accent, #c9a96e)',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{loading ? 'Memverifikasi...' : 'Masuk via PIN'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.45)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
          >
            ← Kembali ke Halaman Utama Website
          </a>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.78rem',
  color: 'rgba(255, 255, 255, 0.75)',
  marginBottom: '0.4rem',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default AdminLogin;
