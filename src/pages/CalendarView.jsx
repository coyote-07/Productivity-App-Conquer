import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Calendar as CalendarIcon, Clock, Plus, 
  MapPin, RefreshCw, ChevronLeft, ChevronRight, X 
} from 'lucide-react';

export default function CalendarView() {
  const {
    events,
    addEvent,
    deleteEvent,
    tasks,
    integrations,
    toggleIntegration
  } = useWorkspace();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Event form states
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtTime, setEvtTime] = useState('10:00');

  // Generate days in month grid (35 cells)
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday...

    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Days in previous month to fill start grid
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells = [];

    // Add padding from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        dayNum: prevMonthDays - i,
        isCurrentMonth: false,
        dateStr: `${year}-${(month).toString().padStart(2, '0')}-${(prevMonthDays - i).toString().padStart(2, '0')}`
      });
    }

    // Add current month days
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        dayNum: i,
        isCurrentMonth: true,
        dateStr: `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
      });
    }

    // Add trailing padding from next month
    const remaining = 35 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        dayNum: i,
        isCurrentMonth: false,
        dateStr: `${year}-${(month + 2).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
      });
    }

    return cells;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (cell) => {
    setSelectedDay(cell.dateStr);
    setShowAddModal(true);
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (!evtTitle.trim() || !selectedDay) return;

    // Combine date + time
    const start = `${selectedDay}T${evtTime}:00`;
    const end = `${selectedDay}T${(parseInt(evtTime.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;

    addEvent(evtTitle, start, end, evtDesc);
    
    // Clear forms
    setEvtTitle('');
    setEvtDesc('');
    setEvtTime('10:00');
    setShowAddModal(false);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const yearNum = currentDate.getFullYear();
  const calendarCells = getDaysInMonth();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', width: '100%', height: '100%', textAlign: 'left' }}>
      
      {/* LEFT COLUMN: MONTH GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Calendar Nav Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>📅 Interactive Calendar</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Track milestones, due dates, and schedule reviews.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1rem', marginRight: '6px' }}>
              {monthName} {yearNum}
            </span>
            <button onClick={handlePrevMonth} className="btn-secondary" style={{ padding: '4px 8px' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNextMonth} className="btn-secondary" style={{ padding: '4px 8px' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 35-Day Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)'
        }}>
          {/* Day of Week Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{
              textAlign: 'center',
              padding: '6px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-hover)'
            }}>
              {d}
            </div>
          ))}

          {/* Grid Cells */}
          {calendarCells.map((cell, idx) => {
            // Find events matching this day
            const cellEvents = events.filter(e => e.start.startsWith(cell.dateStr));
            const cellTasks = tasks.filter(t => t.dueDate === cell.dateStr && t.status !== 'done');

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(cell)}
                style={{
                  minHeight: '80px',
                  padding: '4px',
                  borderRight: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: cell.isCurrentMonth ? 'transparent' : 'var(--bg-surface-hover)',
                  opacity: cell.isCurrentMonth ? 1 : 0.45,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'background-color 150ms'
                }}
                className="calendar-cell-hover"
              >
                {/* Day number */}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  alignSelf: 'flex-start'
                }}>
                  {cell.dayNum}
                </span>

                {/* Event tags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                  {cellEvents.map(e => (
                    <div 
                      key={e.id}
                      style={{
                        backgroundColor: 'var(--accent-glow)',
                        color: 'var(--accent-color)',
                        fontSize: '0.65rem',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={e.title}
                    >
                      {e.title}
                    </div>
                  ))}

                  {cellTasks.map(t => (
                    <div
                      key={t.id}
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                        color: 'var(--accent-tasks)',
                        fontSize: '0.65rem',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        borderLeft: '2px solid var(--accent-tasks)'
                      }}
                      title={`Task: ${t.title}`}
                    >
                      ⌛ {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: EVENTS TIMELINE LIST */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Sync Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>INTEGRATIONS</span>
          <button
            onClick={() => toggleIntegration('googleCalendar')}
            className="btn"
            style={{
              fontSize: '0.8rem',
              width: '100%',
              backgroundColor: integrations.googleCalendar ? 'rgba(66, 133, 244, 0.12)' : 'var(--bg-app)',
              border: integrations.googleCalendar ? '1px solid #4285F4' : '1px solid var(--border-color)',
              color: integrations.googleCalendar ? '#4285F4' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={12} className={integrations.googleCalendar ? 'spin' : ''} />
            {integrations.googleCalendar ? 'Google Calendar Synced' : 'Sync Google Calendar'}
          </button>
        </div>

        {/* Schedule timeline list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>SCHEDULE TIMELINE</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '350px' }}>
            {events.length > 0 ? (
              events.map(e => (
                <div 
                  key={e.id}
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    borderLeft: '3px solid var(--accent-calendar)',
                    padding: '8px',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{e.title}</span>
                    <button 
                      onClick={() => deleteEvent(e.id)}
                      style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    <Clock size={10} />
                    <span>{e.start.replace('T', ' ').substring(11, 16)}</span>
                    {e.description && <span>· {e.description}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.75rem', padding: '1rem 0' }}>
                No events scheduled. Click a day in the calendar grid to block hours.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <form 
            onSubmit={handleSubmitEvent}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '2rem', maxWidth: '380px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold' }}>Schedule Event</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-secondary)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  EVENT TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. System Architecture review"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  STARTING TIME
                </label>
                <input
                  type="time"
                  value={evtTime}
                  onChange={(e) => setEvtTime(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  DESCRIPTION
                </label>
                <textarea
                  placeholder="Notes, link, or locations..."
                  value={evtDesc}
                  onChange={(e) => setEvtDesc(e.target.value)}
                  rows="2"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Block Hours
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
