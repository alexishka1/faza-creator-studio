import React, { useState, useEffect, useCallback } from 'react';

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const BookingCalendar = ({ selectedDate, onDateSelect, onSlotSelect, selectedSlot }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch slot availability saat tanggal berubah
  const fetchSlots = useCallback(async (dateStr) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/availability?tanggal=${dateStr}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  // Generate hari-hari dalam bulan
  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Padding hari kosong di awal
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }
    return days;
  };

  const days = getDaysInMonth(viewYear, viewMonth);

  const handleDayClick = (day) => {
    if (!day) return;
    const date = new Date(viewYear, viewMonth, day);
    if (date < today) return; // Tidak bisa pilih masa lalu
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
    onSlotSelect(''); // Reset slot ketika ganti tanggal
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDayPast = (day) => {
    if (!day) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d < today;
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button type="button" onClick={prevMonth} style={navBtnStyle}>&#8592;</button>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#fff' }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} style={navBtnStyle}>&#8594;</button>
      </div>

      {/* Day Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {days.map((day, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleDayClick(day)}
            disabled={!day || isDayPast(day)}
            style={{
              aspectRatio: '1',
              background: isSelected(day)
                ? '#fff'
                : 'transparent',
              color: isSelected(day)
                ? '#000'
                : !day || isDayPast(day)
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.8)',
              border: isSelected(day)
                ? 'none'
                : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: !day || isDayPast(day) ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              if (day && !isDayPast(day) && !isSelected(day)) {
                e.target.style.background = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected(day)) {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.06)';
              }
            }}
          >
            {day || ''}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div style={{ marginTop: '2rem' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
            Pilih Jam Sesi
          </p>
          {loadingSlots ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Memeriksa ketersediaan...</p>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {slots.map(({ jam, available }) => (
                <button
                  key={jam}
                  type="button"
                  onClick={() => available && onSlotSelect(jam)}
                  disabled={!available}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedSlot === jam
                      ? '1px solid #fff'
                      : available
                        ? '1px solid rgba(255,255,255,0.2)'
                        : '1px solid rgba(255,255,255,0.05)',
                    background: selectedSlot === jam
                      ? '#fff'
                      : 'transparent',
                    color: selectedSlot === jam
                      ? '#000'
                      : available
                        ? 'rgba(255,255,255,0.8)'
                        : 'rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    cursor: available ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {jam}
                  {!available && (
                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>
                      Penuh
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const navBtnStyle = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'border-color 0.2s ease',
};

export default BookingCalendar;
