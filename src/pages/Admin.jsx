import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminOverview from '../components/admin/AdminOverview';
import OccupancyGrid from '../components/admin/OccupancyGrid';
import BookingTable from '../components/admin/BookingTable';
import BlockedSlotManager from '../components/admin/BlockedSlotManager';
import ServiceManager from '../components/admin/ServiceManager';
import ContactSettings from '../components/admin/ContactSettings';
import GalleryManager from '../components/admin/GalleryManager';
import AdminLogin from '../components/admin/AdminLogin';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState(() => sessionStorage.getItem('faza_admin_token') || '');
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('faza_admin_key') || '');
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'occupancy' | 'bookings' | 'blocked' | 'services' | 'gallery' | 'contact'
  const [bookings, setBookings] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0, blocked: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Helper to build headers
  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    const savedToken = sessionStorage.getItem('faza_admin_token');
    const savedKey = sessionStorage.getItem('faza_admin_key');

    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    } else if (savedKey) {
      headers['x-admin-key'] = savedKey;
    }
    return headers;
  }, []);

  // Fetch all bookings and blocked slots
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/admin/bookings', { headers });

      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setBlockedSlots(data.blockedSlots || []);
        if (data.stats) setStats(data.stats);
        setIsAuthenticated(true);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('faza_admin_token');
        sessionStorage.removeItem('faza_admin_key');
      }
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // 1. Check Supabase Auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        setUserEmail(session.user.email || 'admin@fazastudio.com');
        sessionStorage.setItem('faza_admin_token', session.access_token);
        sessionStorage.setItem('faza_admin_email', session.user.email);
        setIsAuthenticated(true);
        fetchData();
        return;
      }

      // 2. Check saved PIN session
      const savedKey = sessionStorage.getItem('faza_admin_key');
      const savedEmail = sessionStorage.getItem('faza_admin_email');
      if (savedKey) {
        setAdminKey(savedKey);
        setUserEmail(savedEmail || 'staf@fazastudio.com');
        setIsAuthenticated(true);
        fetchData();
      }
    };

    checkSession();
  }, [fetchData]);

  // Polling every 30 seconds for live updates
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchData]);

  // Handle Action: Update Booking Status
  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchData();
      } else {
        alert(`Gagal: ${data.error || 'Gagal mengubah status'}`);
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Terjadi kendala jaringan.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Action: Block a Slot
  const handleBlockSlot = async (tanggal, jam, alasan) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tanggal, jam, alasan }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchData();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Handle Action: Unblock a Slot
  const handleUnblockSlot = async (id) => {
    setActionLoading(id + 'unblock');
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const data = await res.json();
        alert(`Gagal: ${data.error || 'Gagal menghapus blokir'}`);
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('faza_admin_token');
    sessionStorage.removeItem('faza_admin_key');
    sessionStorage.removeItem('faza_admin_email');
    setIsAuthenticated(false);
    setUserEmail('');
    setToken('');
    setAdminKey('');
  };

  // If not authenticated, render dedicated Login view
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={({ email, token: newToken, key }) => {
          setUserEmail(email);
          if (newToken) setToken(newToken);
          if (key) setAdminKey(key);
          setIsAuthenticated(true);
          fetchData();
        }}
      />
    );
  }

  // Titles for active tab
  const tabTitles = {
    overview: { title: 'Dashboard Utama', subtitle: 'Ringkasan performa dan notifikasi reservasi studio' },
    occupancy: { title: 'Peta Okupansi Mingguan', subtitle: 'Monitoring ketersediaan slot studio Senin–Minggu realtime' },
    bookings: { title: 'Daftar Reservasi Klien', subtitle: 'Kelola booking masuk, konfirmasi jadwal, dan chat WhatsApp' },
    blocked: { title: 'Manajemen Blokir Jadwal', subtitle: 'Kunci tanggal dan jam jika studio libur atau maintenance' },
    services: { title: 'Paket Layanan & Harga', subtitle: 'Kelola paket B2C Retail dan B2B Creative Space' },
    gallery: { title: 'Galeri & Portfolio', subtitle: 'Upload foto karya studio terbaru dengan kompresi WebP ringan' },
    contact: { title: 'Kontak & Operasional', subtitle: 'Informasi hotline WhatsApp, alamat, dan jam buka studio' },
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.overview;

  return (
    <div className="admin-portal" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0c0a09', color: '#fff' }}>
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={stats.pending}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Topbar Header */}
        <AdminHeader
          title={currentTabInfo.title}
          subtitle={currentTabInfo.subtitle}
          onRefresh={fetchData}
          loading={loading}
          pendingCount={stats.pending}
        />

        {/* Tab Content Body */}
        <main style={{ flex: 1 }}>
          {activeTab === 'overview' && (
            <AdminOverview
              stats={stats}
              bookings={bookings}
              setActiveTab={setActiveTab}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'occupancy' && (
            <OccupancyGrid
              bookings={bookings}
              blockedSlots={blockedSlots}
              onUpdateStatus={handleUpdateStatus}
              onBlockSlot={handleBlockSlot}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingTable
              bookings={bookings}
              onUpdateStatus={handleUpdateStatus}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'blocked' && (
            <BlockedSlotManager
              blockedSlots={blockedSlots}
              onBlockSlot={handleBlockSlot}
              onUnblockSlot={handleUnblockSlot}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'services' && <ServiceManager />}

          {activeTab === 'gallery' && <GalleryManager />}

          {activeTab === 'contact' && <ContactSettings />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
