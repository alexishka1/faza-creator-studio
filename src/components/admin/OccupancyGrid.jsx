import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Package,
  Calendar,
  X,
  AlertTriangle,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const OccupancyGrid = ({
  bookings = [],
  blockedSlots = [],
  onUpdateStatus,
  onBlockSlot,
  actionLoading,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlotData, setSelectedSlotData] = useState(null); // { date, time, booking, isBlocked, blockedInfo }

  // Generate 7 days for the selected week
  const weekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sun, 1 = Mon, ...
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday + weekOffset * 7);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      return {
        dateStr,
        dayName: DAY_NAMES[i],
        formattedDate: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        isToday:
          dateStr ===
          new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }),
      };
    });
  }, [weekOffset]);

  // Fast lookup map for bookings & blocked slots
  const occupancyMap = useMemo(() => {
    const map = {}; // key: `${dateStr}_${slot}`

    // 1. Map blocked slots
    blockedSlots.forEach((blk) => {
      if (!blk.jam) {
        // Entire day blocked
        SLOTS.forEach((slot) => {
          map[`${blk.tanggal}_${slot}`] = {
            isBlocked: true,
            blockedInfo: blk,
          };
        });
      } else {
        map[`${blk.tanggal}_${blk.jam}`] = {
          isBlocked: true,
          blockedInfo: blk,
        };
      }
    });

    // 2. Map bookings (pending / confirmed)
    bookings.forEach((b) => {
      if (b.status === 'confirmed' || b.status === 'pending') {
        map[`${b.tanggal}_${b.jam}`] = {
          booking: b,
          isBooked: true,
        };
      }
    });

    return map;
  }, [bookings, blockedSlots]);

  const handleCellClick = (dateStr, timeSlot) => {
    const slotKey = `${dateStr}_${timeSlot}`;
    const data = occupancyMap[slotKey];

    setSelectedSlotData({
      date: dateStr,
      time: timeSlot,
      booking: data?.booking || null,
      isBlocked: data?.isBlocked || false,
      blockedInfo: data?.blockedInfo || null,
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Top Controls: Week Navigator & Legend */}
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
        {/* Week Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => setWeekOffset((prev) => prev - 1)}
              style={navBtnStyle}
              title="Minggu Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              style={navBtnStyle}
              title="Minggu Berikutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setWeekOffset(0)}
            style={{
              ...navBtnStyle,
              padding: '0.45rem 0.9rem',
              fontWeight: 600,
              backgroundColor:
                weekOffset === 0 ? 'rgba(201, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: weekOffset === 0 ? 'var(--color-accent, #c9a96e)' : '#fff',
            }}
          >
            Minggu Ini
          </button>

          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginLeft: '0.5rem' }}>
            {weekDays[0].formattedDate} – {weekDays[6].formattedDate} {weekDays[0].dateStr.slice(0, 4)}
          </span>
        </div>

        {/* Legend Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(32, 200, 80, 0.15)', border: '1px solid rgba(32, 200, 80, 0.4)' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Tersedia (Buka)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(74, 222, 128, 0.25)', border: '1px solid #4ade80' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Terkonfirmasi (🔒)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(245, 158, 11, 0.25)', border: '1px solid #f59e0b' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Pending Verifikasi (⏳)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(248, 113, 113, 0.2)', border: '1px solid #f87171' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Diblokir / Libur (⛔)</span>
          </div>
        </div>
      </div>

      {/* Matrix Occupancy Grid Table */}
      <div
        style={{
          backgroundColor: '#120f0d',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <th
                style={{
                  padding: '1.1rem 1rem',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  width: '100px',
                }}
              >
                Jam Sesi
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.dateStr}
                  style={{
                    padding: '1rem 0.6rem',
                    textAlign: 'center',
                    backgroundColor: day.isToday ? 'rgba(201, 169, 110, 0.08)' : 'transparent',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: day.isToday ? 'var(--color-accent, #c9a96e)' : 'rgba(255, 255, 255, 0.6)',
                      fontWeight: 600,
                    }}
                  >
                    {day.dayName}
                  </p>
                  <p
                    style={{
                      margin: '0.2rem 0 0',
                      fontSize: '1rem',
                      fontWeight: day.isToday ? 700 : 500,
                      color: day.isToday ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {day.formattedDate}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {SLOTS.map((slot) => (
              <tr
                key={slot}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Time Slot Header */}
                <td
                  style={{
                    padding: '1rem 0.8rem',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-accent, #c9a96e)',
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  }}
                >
                  {slot}
                </td>

                {/* Days Cells */}
                {weekDays.map((day) => {
                  const slotKey = `${day.dateStr}_${slot}`;
                  const data = occupancyMap[slotKey];
                  const isBooked = !!data?.booking;
                  const isBlocked = !!data?.isBlocked;
                  const booking = data?.booking;

                  let cellBg = 'rgba(32, 200, 80, 0.04)';
                  let cellBorder = '1px solid transparent';
                  let cellTextColor = 'rgba(255, 255, 255, 0.4)';
                  let statusTag = 'Tersedia';

                  if (isBlocked) {
                    cellBg = 'rgba(248, 113, 113, 0.12)';
                    cellBorder = '1px solid rgba(248, 113, 113, 0.3)';
                    cellTextColor = '#f87171';
                    statusTag = 'Diblokir';
                  } else if (isBooked) {
                    if (booking.status === 'confirmed') {
                      cellBg = 'rgba(74, 222, 128, 0.15)';
                      cellBorder = '1px solid rgba(74, 222, 128, 0.4)';
                      cellTextColor = '#4ade80';
                      statusTag = 'Terkonfirmasi';
                    } else if (booking.status === 'pending') {
                      cellBg = 'rgba(245, 158, 11, 0.18)';
                      cellBorder = '1px solid rgba(245, 158, 11, 0.45)';
                      cellTextColor = '#f59e0b';
                      statusTag = 'Pending';
                    }
                  }

                  return (
                    <td
                      key={day.dateStr}
                      onClick={() => handleCellClick(day.dateStr, slot)}
                      style={{
                        padding: '0.6rem 0.5rem',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        verticalAlign: 'top',
                        height: '75px',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'none';
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: cellBg,
                          border: cellBorder,
                          borderRadius: '6px',
                          padding: '0.45rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        {isBooked ? (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: cellTextColor, textTransform: 'uppercase' }}>
                                {booking.status === 'confirmed' ? '🔒 Locked' : '⏳ Pending'}
                              </span>
                              <Lock size={12} color={cellTextColor} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {booking.nama}
                              </p>
                              <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {booking.layanan}
                              </p>
                            </div>
                          </>
                        ) : isBlocked ? (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f87171' }}>⛔ Tutup</span>
                              <Lock size={12} color="#f87171" />
                            </div>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                              {data.blockedInfo?.alasan || 'Studio Off'}
                            </p>
                          </>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6 }}>
                            <span style={{ fontSize: '0.72rem', color: '#20c850' }}>+ Buka</span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Detail Modal on Cell Click */}
      {selectedSlotData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setSelectedSlotData(null)}
        >
          <div
            style={{
              backgroundColor: '#181412',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-accent, #c9a96e)', fontWeight: 600 }}>
                  Detail Slot Jadwal
                </span>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.2rem', color: '#fff' }}>
                  {selectedSlotData.date} · Pukul {selectedSlotData.time} WIB
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotData(null)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            {selectedSlotData.booking ? (
              <div>
                {/* Status Badge */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <span
                    style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor:
                        selectedSlotData.booking.status === 'confirmed'
                          ? 'rgba(74, 222, 128, 0.2)'
                          : 'rgba(245, 158, 11, 0.2)',
                      color:
                        selectedSlotData.booking.status === 'confirmed' ? '#4ade80' : '#f59e0b',
                    }}
                  >
                    Status: {selectedSlotData.booking.status}
                  </span>
                </div>

                {/* Booking Info Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontSize: '0.9rem' }}>
                    <User size={16} color="var(--color-accent, #c9a96e)" />
                    <strong>{selectedSlotData.booking.nama}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    <Package size={16} color="var(--color-accent, #c9a96e)" />
                    <span>{selectedSlotData.booking.layanan}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    <Phone size={16} color="var(--color-accent, #c9a96e)" />
                    <span>{selectedSlotData.booking.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    <Mail size={16} color="var(--color-accent, #c9a96e)" />
                    <span>{selectedSlotData.booking.email}</span>
                  </div>
                  {selectedSlotData.booking.pesan && selectedSlotData.booking.pesan !== '-' && (
                    <div style={{ marginTop: '0.5rem', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                      <strong>Catatan Klien:</strong> {selectedSlotData.booking.pesan}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem' }}>
                  {/* WhatsApp Direct Chat */}
                  <a
                    href={`https://wa.me/${selectedSlotData.booking.phone?.replace(/\D/g, '').replace(/^0/, '62')}?text=Halo%20${encodeURIComponent(selectedSlotData.booking.nama)}%2C%20kami%20dari%20Faza%20Studio%20mengenai%20reservasi%20sesi%20${encodeURIComponent(selectedSlotData.booking.layanan)}%20pada%20${selectedSlotData.booking.tanggal}%20pukul%20${selectedSlotData.booking.jam}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      background: 'var(--color-wa-gradient, linear-gradient(135deg, #32e064 0%, #20be4e 50%, #159b3c 100%))',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                    }}
                  >
                    <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px' }} />
                    Chat Klien via WhatsApp
                  </a>

                  {/* Confirm & Cancel Actions */}
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {selectedSlotData.booking.status === 'pending' && (
                      <button
                        onClick={async () => {
                          await onUpdateStatus(selectedSlotData.booking.id, 'confirmed');
                          setSelectedSlotData(null);
                        }}
                        disabled={actionLoading === selectedSlotData.booking.id + 'confirmed'}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          backgroundColor: '#22c55e',
                          color: '#fff',
                          fontWeight: 600,
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Konfirmasi Jadwal
                      </button>
                    )}

                    {selectedSlotData.booking.status !== 'cancelled' && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Batalkan reservasi ini? Slot waktu akan otomatis dibuka kembali untuk klien lain.')) {
                            await onUpdateStatus(selectedSlotData.booking.id, 'cancelled');
                            setSelectedSlotData(null);
                          }
                        }}
                        disabled={actionLoading === selectedSlotData.booking.id + 'cancelled'}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          backgroundColor: 'rgba(248, 113, 113, 0.15)',
                          color: '#f87171',
                          fontWeight: 600,
                          border: '1px solid rgba(248, 113, 113, 0.3)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Batalkan (Buka Slot)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : selectedSlotData.isBlocked ? (
              <div>
                <div style={{ padding: '1rem', backgroundColor: 'rgba(248, 113, 113, 0.1)', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.25)', marginBottom: '1.2rem' }}>
                  <p style={{ margin: 0, color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>
                    Slot Waktu Ini Sedang Diblokir / Ditutup
                  </p>
                  <p style={{ margin: '0.4rem 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                    Alasan: {selectedSlotData.blockedInfo?.alasan || 'Maintenance / Libur Studio'}
                  </p>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  Untuk membuka kembali slot ini, buka tab <strong>"Manajemen Blokir"</strong> dan klik <em>"Buka Blokir (Hapus)"</em>.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.9rem', color: '#4ade80', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} /> Slot Waktu Ini Tersedia & Terbuka untuk Reservasi
                </p>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Klien dapat memilih slot ini dari formulir reservasi website. Anda juga dapat memblokir slot ini jika ingin menutup jadwal sementara.
                </p>
                <button
                  onClick={async () => {
                    await onBlockSlot(selectedSlotData.date, selectedSlotData.time, 'Reservasi Offline / Maintenance');
                    setSelectedSlotData(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(248, 113, 113, 0.15)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: '6px',
                    color: '#f87171',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🔒 Kunci / Blokir Slot Ini Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const navBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.45rem 0.65rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

export default OccupancyGrid;
