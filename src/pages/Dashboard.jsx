import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  CheckCircle, Circle, ArrowRight, Play, 
  Sparkles, FileText, Calendar, Flame, AlertCircle 
} from 'lucide-react';

export default function Dashboard() {
  const {
    user,
    tasks,
    updateTask,
    goals,
    habits,
    notes,
    events,
    setActiveSection,
    setSelectedNoteId,
    setPomodoro,
    showToast
  } = useWorkspace();

  const [aiBriefOpen, setAiBriefOpen] = useState(true);

  // Time-based greeting helper
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Calculate metrics
  const todayTasks = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && t.status !== 'done');
  const pinnedTasks = tasks.slice(0, 3); // Grab top 3 tasks as focus

  const activeGoals = goals.filter(g => g.progress < 100);
  const avgGoalProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length) 
    : 0;

  // Handle habit completions checks for current week (Mon-Sun)
  const currentWeekDays = [...Array(7).keys()].map(i => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + i; // adjust when day is Sunday
    const weekDay = new Date(d.setDate(diff));
    return weekDay.toISOString().split('T')[0];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Banner Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '4px' }}>
            {getGreeting()}, {user?.name || 'Conqueror'} 👋
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>Today is {todayStr}</span>
          </div>
        </div>
      </div>

      {/* AI Daily Brief Widget */}
      {aiBriefOpen && (
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1.25rem'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(124, 58, 237, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8B5CF6',
            flexShrink: 0
          }}>
            <Sparkles size={16} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>AI Daily Command Brief</span>
              <button 
                onClick={() => setAiBriefOpen(false)} 
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
              >
                Dismiss
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              Welcome! You have <strong>{todayTasks.length} tasks</strong> due today. 
              Your active goal <em>"{activeGoals[0]?.title || 'System Setup'}"</em> is at <strong>{activeGoals[0]?.progress || 0}%</strong> progress. 
              Keep up your streak: your <strong>{habits[0]?.name || 'morning routine'}</strong> habit is ready to log. Focus and conquer!
            </p>
          </div>
        </div>
      )}

      {/* Grid Layout Widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* WIDGET 1: TODAY'S FOCUS TASKS */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>🎯 Today's Focus</h3>
            <button 
              onClick={() => setActiveSection('tasks')} 
              style={{ fontSize: '0.75rem', color: 'var(--accent-dashboard)', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              All Tasks <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pinnedTasks.length > 0 ? (
              pinnedTasks.map(task => (
                <div 
                  key={task.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <button 
                    onClick={() => updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                    style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                  >
                    {task.status === 'done' ? (
                      <CheckCircle size={18} style={{ color: 'var(--accent-goals)' }} />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <span style={{ 
                    fontSize: '0.85rem',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {task.title}
                  </span>
                  <span className={`priority-dot priority-${task.priority}`} title={`Priority: ${task.priority}`} />
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', padding: '1rem 0' }}>
                Nothing to conquer today — or is there? Add your first task.
              </div>
            )}
          </div>
        </div>

        {/* WIDGET 2: GOALS PROGRESS RING */}
        <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', textAlign: 'left' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border-color)" strokeWidth="3.5" />
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke="var(--accent-goals)" 
                strokeWidth="3.5" 
                strokeDasharray="100" 
                strokeDashoffset={100 - avgGoalProgress} 
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'var(--text-primary)'
            }}>
              {avgGoalProgress}%
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '4px' }}>Goal Progress</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 8px' }}>
              Average progress across all active goal milestones.
            </p>
            <button 
              onClick={() => setActiveSection('goals-habits')} 
              className="btn"
              style={{ padding: '4px 8px', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}
            >
              Review Goals
            </button>
          </div>
        </div>

        {/* WIDGET 3: HABIT STREAK SUMMARY */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>🔥 Habit Streaks</h3>
            <button onClick={() => setActiveSection('goals-habits')} style={{ fontSize: '0.75rem', color: 'var(--accent-goals)' }}>
              View Habits
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {habits.slice(0, 3).map(habit => (
              <div key={habit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{habit.icon}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{habit.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-goals)', fontWeight: 'bold' }}>
                  <Flame size={14} fill="currentColor" />
                  <span>{habit.streak} day streak</span>
                </div>
              </div>
            ))}
            {habits.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
                Every streak starts with day one. Add a habit.
              </div>
            )}
          </div>
        </div>

        {/* WIDGET 4: POMODORO QUICK-START */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>⏱️ Focus Sessions</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Start a quick 25-minute study or development focus block.
          </p>
          
          <button
            onClick={() => {
              setPomodoro(prev => ({
                ...prev,
                status: 'running',
                mode: 'focus',
                duration: 1500
              }));
              showToast("Pomodoro Timer Started in Right Panel!");
            }}
            className="btn-primary"
            style={{
              padding: '8px 12px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: 'auto'
            }}
          >
            <Play size={14} fill="currentColor" />
            Start Pinned Focus Session
          </button>
        </div>

        {/* WIDGET 5: RECENT PAGES */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>📝 Recent Notes</h3>
            <button onClick={() => setActiveSection('notes')} style={{ fontSize: '0.75rem', color: 'var(--accent-notes)' }}>
              All Notes
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {notes.slice(0, 3).map(note => (
              <div 
                key={note.id} 
                onClick={() => {
                  setActiveSection('notes');
                  setSelectedNoteId(note.id);
                }}
                className="card"
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-app)',
                  cursor: 'pointer',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span>{note.icon}</span>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {note.title}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {note.readTime} min read · {note.wordCount} words
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', gridColumn: 'span 3', textAlign: 'center', padding: '1rem 0' }}>
                Your thoughts deserve a home. Start writing.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
