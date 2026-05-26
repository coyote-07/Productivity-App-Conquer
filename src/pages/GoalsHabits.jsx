import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Target, Award, Flame, Check, Plus, 
  Trash2, BookOpen, Heart, Sparkles, LayoutGrid 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoalsHabits() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    domains,
    addXP,
    showToast
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState('goals'); // goals, habits, review
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);

  // Goal Form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalCat, setGoalCat] = useState('work');
  const [goalDom, setGoalDom] = useState('');

  // Habit Form
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('🎯');
  const [habitFreq, setHabitFreq] = useState('daily');
  const [habitCat, setHabitCat] = useState('productivity');

  // Weekly Reflection Journal Text
  const [reflectionText, setReflectionText] = useState('');

  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal(goalTitle, goalDesc, goalDate, goalCat, goalDom || null);
    setGoalTitle('');
    setGoalDesc('');
    setGoalDate('');
    setShowGoalModal(false);
  };

  const handleAddHabitSubmit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    addHabit(habitName, habitIcon, habitFreq, habitCat);
    setHabitName('');
    setShowHabitModal(false);
  };

  const handleCheckMilestone = (goal, milestoneId) => {
    const miles = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    // Recalculate goal progress %
    const completedCount = miles.filter(m => m.completed).length;
    const progress = Math.round((completedCount / miles.length) * 100);

    updateGoal(goal.id, {
      milestones: miles,
      progress: progress
    });

    if (progress === 100) {
      showToast(`Goal Completed! +200 XP`);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      addXP(25); // smaller reward for milestone
    }
  };

  const handleAddMilestone = (goalId) => {
    const text = prompt("Enter milestone title:");
    if (!text) return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newMilestone = {
      id: 'mile_' + Date.now(),
      title: text,
      completed: false
    };

    const miles = [...(goal.milestones || []), newMilestone];
    const completedCount = miles.filter(m => m.completed).length;
    const progress = Math.round((completedCount / miles.length) * 100);

    updateGoal(goalId, {
      milestones: miles,
      progress: progress
    });
  };

  // Generate GitHub contrib heatmap dates (last 20 weeks)
  const getHeatmapWeeks = () => {
    const dates = [];
    const today = new Date();
    // Go back 140 days (20 weeks) to make a clean compact grid
    for (let i = 139; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const heatmapDates = getHeatmapWeeks();

  // Count completions on a specific date across all habits
  const getCompletionsCount = (dateStr) => {
    let count = 0;
    habits.forEach(h => {
      if (h.completions && h.completions.includes(dateStr)) {
        count++;
      }
    });
    return count;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', height: '100%', textAlign: 'left' }}>
      
      {/* Header Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>🎯 Goals & Habits Command</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Establish routines, break down milestones, and track streaks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Tab selector */}
          <div style={{ display: 'flex', backgroundColor: 'var(--border-color)', padding: '2px', borderRadius: '6px' }}>
            {['goals', 'habits', 'review'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  borderRadius: '4px',
                  backgroundColor: activeTab === tab ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => activeTab === 'goals' ? setShowGoalModal(true) : setShowHabitModal(true)}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.85rem', display: activeTab === 'review' ? 'none' : 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={14} /> New {activeTab === 'goals' ? 'Goal' : 'Habit'}
          </button>
        </div>
      </div>

      {/* VIEW 1: GOALS TRACKER */}
      {activeTab === 'goals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {goals.map(g => {
            const dom = domains.find(d => d.id === g.domainId);
            return (
              <div key={g.id} className="card accented active-goals" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: '0 0 2px' }}>{g.title}</h3>
                    {dom && (
                      <span style={{
                        fontSize: '0.65rem',
                        backgroundColor: 'rgba(124, 58, 237, 0.15)',
                        color: 'var(--accent-domains)',
                        padding: '1px 5px',
                        borderRadius: '4px'
                      }}>
                        {dom.icon} {dom.name}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteGoal(g.id)}
                    style={{ color: 'var(--text-muted)' }}
                    title="Delete Goal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {g.description}
                </p>

                {/* Progress Bar */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px', fontWeight: 'bold' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Milestone Progress</span>
                    <span style={{ color: 'var(--accent-color)' }}>{g.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${g.progress}%`, height: '100%', backgroundColor: 'var(--accent-color)', transition: 'width 0.3s' }} />
                  </div>
                </div>

                {/* Milestones checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>MILESTONES Checklist</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                    {(g.milestones || []).map(m => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          checked={m.completed}
                          onChange={() => handleCheckMilestone(g, m.id)}
                          style={{ width: 'auto' }}
                        />
                        <span style={{ textDecoration: m.completed ? 'line-through' : 'none', color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddMilestone(g.id)}
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--accent-color)',
                      textAlign: 'left',
                      marginTop: '2px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <Plus size={12} /> Add Milestone item
                  </button>
                </div>

                {/* Deadline countdown */}
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '8px',
                  marginTop: 'auto',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Target Deadline:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{g.targetDate}</span>
                </div>

              </div>
            );
          })}

          {goals.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', gridColumn: 'span 3', padding: '1rem 0' }}>
              No active goals — or is there? Create your first one.
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: HABITS & HEATMAP */}
      {activeTab === 'habits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* GitHub Streak Heatmap widget */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>📊 Annual Habit Completions Grid</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Shows completions over the last 140 days. Darker green blocks represent more routines completed that calendar day.
            </p>

            {/* Heatmap blocks */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(20, 1fr)',
              gap: '4px',
              padding: '0.5rem 0',
              overflowX: 'auto'
            }}>
              {/* Columns of weeks */}
              {[...Array(20)].map((_, wkIdx) => (
                <div key={wkIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[...Array(7)].map((_, dyIdx) => {
                    const idx = wkIdx * 7 + dyIdx;
                    const dateStr = heatmapDates[idx];
                    if (!dateStr) return null;

                    const count = getCompletionsCount(dateStr);
                    let level = 0;
                    if (count > 0 && count <= 1) level = 1;
                    else if (count > 1 && count <= 2) level = 2;
                    else if (count > 2 && count <= 3) level = 3;
                    else if (count > 3) level = 4;

                    return (
                      <div
                        key={dyIdx}
                        className={`heatmap-cell heatmap-level-${level}`}
                        title={`${dateStr}: ${count} completions`}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '2px'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend info */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Less</span>
              <div style={{ width: '10px', height: '10px', background: '#1a1a1a', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.25)', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.5)', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.75)', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', background: 'rgb(16, 185, 129)', borderRadius: '2px' }} />
              <span>More</span>
            </div>
          </div>

          {/* Habits Cards list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {habits.map(h => {
              const isChecked = h.completions && h.completions.includes(todayStr);

              return (
                <div key={h.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                  
                  {/* Tap checkmark circle button */}
                  <button
                    onClick={() => toggleHabit(h.id, todayStr)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '2px solid var(--border-color)',
                      backgroundColor: isChecked ? 'var(--accent-goals)' : 'transparent',
                      color: isChecked ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 150ms'
                    }}
                    title={isChecked ? 'Mark pending' : 'Check off today'}
                  >
                    {isChecked ? <Check size={18} /> : h.icon}
                  </button>

                  <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {h.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Frequency: {h.frequency} · {h.category}
                    </div>
                  </div>

                  {/* Streaks metrics display */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-goals)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Flame size={12} fill="currentColor" />
                      {h.streak}d
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Record: {h.longestStreak}d
                    </span>
                  </div>

                  {/* Delete Option */}
                  <button
                    onClick={() => {
                      if(confirm("Delete habit?")) deleteHabit(h.id);
                    }}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                    title="Delete Habit"
                  >
                    ✕
                  </button>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: WEEKLY REVIEW REFLECTION */}
      {activeTab === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '650px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>📊 Weekly Workload Reflections</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-goals)' }}>
                  {habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length) : 0} Days
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Habit Streak</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-dashboard)' }}>
                  +120 XP
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gamification Points Logged</div>
              </div>
            </div>

            {/* Reflection Text Editor */}
            <div style={{ textAlign: 'left', marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                WRITE YOUR WEEKLY REFLECTION JOURNAL
              </label>
              <textarea
                placeholder="What went well? Where did you face friction? How can you optimize your setup for next week?"
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                rows="5"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <button
              onClick={() => {
                if (!reflectionText.trim()) return;
                addXP(40);
                showToast("Reflection logged! +40 XP");
                setReflectionText('');
              }}
              className="btn-primary active-goals"
              style={{ width: '100%', padding: '8px', fontWeight: '600', fontSize: '0.85rem' }}
            >
              Log Weekly Reflection Review
            </button>
          </div>
        </div>
      )}

      {/* Goal creation modal */}
      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <form 
            onSubmit={handleAddGoalSubmit}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '2rem', maxWidth: '400px' }}
          >
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 'bold' }}>Establish New System Goal</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  GOAL TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master React Native"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  DESCRIPTION
                </label>
                <textarea
                  placeholder="Explain why this goal matters..."
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  rows="2"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    CATEGORY
                  </label>
                  <select value={goalCat} onChange={(e) => setGoalCat(e.target.value)}>
                    <option value="work">💼 Work</option>
                    <option value="health">🏋️ Health</option>
                    <option value="learning">📚 Learning</option>
                    <option value="personal">🎯 Personal</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    TARGET DATE
                  </label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  LINKED LIFE CONTAINER
                </label>
                <select value={goalDom} onChange={(e) => setGoalDom(e.target.value)}>
                  <option value="">None</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowGoalModal(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Deploy Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Habit creation modal */}
      {showHabitModal && (
        <div className="modal-overlay" onClick={() => setShowHabitModal(false)}>
          <form 
            onSubmit={handleAddHabitSubmit}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '2rem', maxWidth: '400px' }}
          >
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 'bold' }}>Deploy Daily Habit</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  HABIT NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meditate, Read 10 pages"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    EMOJI ICON
                  </label>
                  <select value={habitIcon} onChange={(e) => setHabitIcon(e.target.value)}>
                    <option value="🎯">🎯 Target</option>
                    <option value="🌅">🌅 Sun</option>
                    <option value="🏋️">🏋️ Weights</option>
                    <option value="💧">💧 Water</option>
                    <option value="📚">📚 Book</option>
                    <option value="🎨">🎨 Palette</option>
                    <option value="🧠">🧠 Brain</option>
                    <option value="🏃">🏃 Running</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    FREQUENCY
                  </label>
                  <select value={habitFreq} onChange={(e) => setHabitFreq(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="3-times-week">3x per week</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  CATEGORY
                </label>
                <select value={habitCat} onChange={(e) => setHabitCat(e.target.value)}>
                  <option value="productivity">🧠 Productivity</option>
                  <option value="health">🏋️ Health & Fitness</option>
                  <option value="finance">💵 Finance</option>
                  <option value="education">📚 Education</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowHabitModal(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Deploy Habit
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
