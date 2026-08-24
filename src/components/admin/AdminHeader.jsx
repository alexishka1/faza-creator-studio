import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Bell } from 'lucide-react';

const AdminHeader = ({ title, subtitle, onRefresh, loading, pendingCount = 0 }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#120f0d',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#fff',
            margin: 0,
            fontFamily: 'var(--font-serif, "Playfair Display", serif)',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', margin: '0.2rem 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Actions: Live Clock, Pending Badge & Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Live WIB Clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.75)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <Clock size={14} color="var(--color-accent, #c9a96e)" />
          <span>{time || '09.00 WIB'}</span>
        </div>

        {/* Pending Badge */}
        {pendingCount > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '6px',
              color: '#f59e0b',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <Bell size={14} />
            <span>{pendingCount} Menunggu Konfirmasi</span>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Menyinkronkan...' : 'Sinkronkan Data'}</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
