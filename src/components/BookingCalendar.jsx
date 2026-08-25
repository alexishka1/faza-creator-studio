import React, { useState, useEffect, useCallback } from 'react';
import '../index.css';

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
        <button
          type="button"
          onClick={prevMonth}
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          &#8592;
        </button>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-text)', fontWeight: 600 }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          &#8594;
        </button>
      </div>

      {/* Day Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 0', fontWeight: 600 }}>
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
                background: sel ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: sel ? '#ffffff' : past ? 'var(--color-text-muted)' : 'var(--color-text)',
                opacity: past ? 0.35 : 1,
                border: sel ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
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
            SELECT TIME SLOT FOR <strong style={{ color: 'var(--color-text)' }}>{selectedDate}</strong>:
          </p>

          {loadingSlots ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Checking live slot availability...</p>
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
                        ? 'var(--color-bg-secondary)'
                        : 'var(--color-bg-card)',
                      color: isSlotSel ? '#ffffff' : isTaken ? 'var(--color-text-muted)' : 'var(--color-text)',
                      opacity: isTaken ? 0.45 : 1,
                      border: isSlotSel
                        ? '1px solid var(--color-accent)'
                        : isTaken
                        ? '1px solid var(--color-border)'
                        : '1px solid var(--color-border)',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: isSlotSel ? '700' : '500',
                      cursor: isTaken ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      boxShadow: isSlotSel ? 'var(--color-card-shadow)' : 'none',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    <div>{slot.slot}</div>
                    <div style={{ fontSize: '0.68rem', marginTop: '2px', opacity: 0.85, color: isSlotSel ? '#fff' : isTaken ? 'var(--color-text-muted)' : 'var(--color-accent)' }}>
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

export default BookingCalendar;
