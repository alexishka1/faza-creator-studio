import React, { useState, useEffect, useCallback } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BookingCalendar = ({ selectedDate, onDateSelect, onSlotSelect, selectedSlot }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch slot availability when date changes
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

  // Generate days in month
  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Padding empty days at start
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
    if (date < today) return; // Cannot select past dates
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
    onSlotSelect(''); // Reset slot on date change
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
          <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} style={{ height: '40px' }} />;
          }

          const past = isDayPast(day);
          const sel = isSelected(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={past}
              onClick={() => handleDayClick(day)}
              style={{
                height: '40px',
                background: sel ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                color: sel ? '#000' : past ? 'rgba(255,255,255,0.15)' : '#fff',
                border: sel ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: sel ? '700' : '400',
                cursor: past ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Time Slot Picker */}
      {selectedDate && (
        <div style={{ marginTop: '2rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.8rem', letterSpacing: '0.05em' }}>
            SELECT TIME SLOT FOR <strong style={{ color: '#fff' }}>{selectedDate}</strong>:
          </p>

          {loadingSlots ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Checking live slot availability...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
              {slots.map(slot => {
                const isTaken = !slot.available;
                const isSlotSel = selectedSlot === slot.slot;

                return (
                  <button
                    key={slot.slot}
                    type="button"
                    disabled={isTaken}
                    onClick={() => onSlotSelect(slot.slot)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      background: isSlotSel
                        ? 'var(--color-accent)'
                        : isTaken
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(255,255,255,0.05)',
                      color: isSlotSel ? '#000' : isTaken ? 'rgba(255,255,255,0.2)' : '#fff',
                      border: isSlotSel
                        ? '1px solid var(--color-accent)'
                        : isTaken
                        ? '1px solid rgba(255,255,255,0.04)'
                        : '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: isSlotSel ? '700' : '400',
                      cursor: isTaken ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    <div>{slot.slot}</div>
                    <div style={{ fontSize: '0.68rem', marginTop: '2px', opacity: 0.75 }}>
                      {isTaken ? '🔒 Reserved' : '✓ Available'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const navBtnStyle = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  width: '32px',
  height: '32px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default BookingCalendar;
