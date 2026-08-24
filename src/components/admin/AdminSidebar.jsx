import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Lock,
  Package,
  Image,
  PhoneCall,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  userEmail = '',
  onLogout,
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'occupancy',
      label: 'Peta Okupansi Mingguan',
      icon: CalendarDays,
      badge: 'Live',
      badgeColor: '#20c850',
    },
    {
      id: 'bookings',
      label: 'Daftar Reservasi',
      icon: ClipboardList,
      badge: pendingCount > 0 ? `${pendingCount} Baru` : null,
      badgeColor: '#f59e0b',
    },
    {
      id: 'blocked',
      label: 'Manajemen Blokir',
      icon: Lock,
    },
    {
      id: 'services',
      label: 'Paket & Harga',
      icon: Package,
    },
    {
      id: 'gallery',
      label: 'Galeri Foto',
      icon: Image,
    },
    {
      id: 'contact',
      label: 'Kontak Studio',
      icon: PhoneCall,
    },
  ];

  return (
    <aside
      style={{
        width: '280px',
        backgroundColor: '#0c0a09',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand & Admin Badge */}
      <div>
        <div
          style={{
            padding: '1.8rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#20c850',
                boxShadow: '0 0 10px #20c850',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.04em',
              }}
            >
              FAZA STUDIO
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.6rem',
              fontSize: '0.72rem',
              color: 'var(--color-accent, #c9a96e)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={14} />
            <span>Admin Portal v2.0</span>
          </div>
        </div>

        {/* User Info Bar */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
            {userEmail || 'admin@fazastudio.com'}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(32, 200, 80, 0.15)',
              color: '#20c850',
              fontWeight: 600,
            }}
          >
            Active
          </span>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '1.2rem 0.8rem' }}>
          <p
            style={{
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.35)',
              padding: '0 0.8rem 0.6rem',
              fontWeight: 600,
            }}
          >
            Menu Manajemen
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? 'rgba(201, 169, 110, 0.15)' : 'transparent',
                      color: isActive ? 'var(--color-accent, #c9a96e)' : 'rgba(255, 255, 255, 0.75)',
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? '3px solid var(--color-accent, #c9a96e)' : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Icon size={18} color={isActive ? 'var(--color-accent, #c9a96e)' : 'currentColor'} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '12px',
                          backgroundColor: item.badgeColor || '#c9a96e',
                          color: '#000',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer / Logout */}
      <div
        style={{
          padding: '1.2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          <ExternalLink size={14} />
          <span>Lihat Web Publik</span>
        </a>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'rgba(248, 113, 113, 0.12)',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.12)';
          }}
        >
          <LogOut size={14} />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
