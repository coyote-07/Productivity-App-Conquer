import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Plus, Calendar, Circle, CheckCircle, 
  Trash2, X, Tag, List, Clock, Eye 
} from 'lucide-react';

export default function Tasks() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    domains,
    addComment,
    selectedTaskId,
    setSelectedTaskId
  } = useWorkspace();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDomain, setNewTaskDomain] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDate, setNewTaskDate] = useState('');
  
  // Editor details states
  const [subtaskText, setSubtaskText] = useState('');
  const [taskComment, setTaskComment] = useState('');
  const [timeLogMins, setTimeLogMins] = useState('');

  const activeTask = tasks.find(t => t.id === selectedTaskId);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask(
      newTaskTitle,
      newTaskDate || null,
      newTaskDomain || null,
      newTaskPriority
    );
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!subtaskText.trim() || !activeTask) return;

    const newSub = {
      id: 'sub_' + Date.now(),
      title: subtaskText,
      done: false
    };

    updateTask(activeTask.id, {
      subtasks: [...(activeTask.subtasks || []), newSub]
    });
    setSubtaskText('');
  };

  const toggleSubtask = (subId) => {
    if (!activeTask) return;
    const subs = activeTask.subtasks.map(s => 
      s.id === subId ? { ...s, done: !s.done } : s
    );
    updateTask(activeTask.id, { subtasks: subs });
  };

  const handleLogTime = (e) => {
    e.preventDefault();
    const mins = parseInt(timeLogMins);
    if (isNaN(mins) || mins <= 0 || !activeTask) return;

    const log = {
      id: 'log_' + Date.now(),
      duration: mins,
      taskName: activeTask.title,
      timestamp: new Date().toISOString()
    };

    updateTask(activeTask.id, {
      timeLogs: [...(activeTask.timeLogs || []), log]
    });
    setTimeLogMins('');
  };

  // Grouping tasks
  const todayStr = new Date().toISOString().split('T')[0];
  
  const getTasksGroup = (group) => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const endOfWeek = new Date(now.getTime() + 86400000 * 7);

    return tasks.filter(t => {
      if (!t.dueDate) return group === 'no-date';
      const d = new Date(t.dueDate);
      d.setHours(0,0,0,0);

      if (t.dueDate === todayStr) return group === 'today';
      if (d > now && d <= endOfWeek) return group === 'week';
      if (d > endOfWeek) return group === 'upcoming';
      return group === 'upcoming'; // default backlog
    });
  };

  const groups = [
    { id: 'today', title: '📅 Today Focus', tasks: getTasksGroup('today') },
    { id: 'week', title: '📆 This Week', tasks: getTasksGroup('week') },
    { id: 'upcoming', title: '🗓️ Upcoming Backlog', tasks: getTasksGroup('upcoming') },
    { id: 'no-date', title: '📂 Indefinite / No Date', tasks: getTasksGroup('no-date') }
  ];

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', height: '100%', textAlign: 'left', position: 'relative' }}>
      
      {/* LEFT AREA: TASKS ACCORDION LIST */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Page title */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>✅ Task Command Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            List, prioritize, and log pomodoro hours to execute goals.
          </p>
        </div>

        {/* Quick Task Creation form */}
        <form onSubmit={handleCreateTask} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          backgroundColor: 'var(--bg-surface)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <input
            type="text"
            placeholder="Add task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />

          <select
            value={newTaskDomain || ''}
            onChange={(e) => setNewTaskDomain(e.target.value)}
            style={{ width: '130px' }}
          >
            <option value="">-- Life Domain --</option>
            {domains.map(d => (
              <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
            ))}
          </select>

          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            style={{ width: '110px' }}
          >
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <input
            type="date"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            style={{ width: '130px' }}
          />

          <button type="submit" className="btn-primary" style={{ padding: '6px 16px' }}>
            <Plus size={16} /> Add Task
          </button>
        </form>

        {/* Task Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {groups.map(grp => (
            <div key={grp.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                {grp.title} ({grp.tasks.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {grp.tasks.map(t => {
                  const dom = domains.find(d => d.id === t.domainId);
                  const isOverdue = t.dueDate && t.dueDate < todayStr && t.status !== 'done';
                  
                  return (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: selectedTaskId === t.id ? 'var(--accent-bg-subtle)' : 'var(--bg-surface)',
                        border: selectedTaskId === t.id ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 150ms'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTask(t.id, { status: t.status === 'done' ? 'todo' : 'done' });
                          }}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          {t.status === 'done' ? (
                            <CheckCircle size={18} style={{ color: 'var(--accent-goals)' }} />
                          ) : (
                            <Circle size={18} style={{ color: 'var(--text-muted)' }} />
                          )}
                        </button>

                        <span style={{
                          textDecoration: t.status === 'done' ? 'line-through' : 'none',
                          color: t.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {t.title}
                        </span>

                        {dom && (
                          <span style={{
                            fontSize: '0.7rem',
                            backgroundColor: 'rgba(124, 58, 237, 0.15)',
                            color: 'var(--accent-domains)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {dom.icon} {dom.name}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {t.dueDate && (
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: isOverdue ? '#F87171' : 'var(--text-muted)',
                            fontWeight: isOverdue ? 'bold' : 'normal' 
                          }}>
                            {isOverdue ? 'Overdue ' : ''}{t.dueDate}
                          </span>
                        )}
                        <span className={`priority-dot priority-${t.priority}`} title={t.priority} />
                      </div>
                    </div>
                  );
                })}

                {grp.tasks.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', padding: '4px 0' }}>
                    Nothing to conquer in this section.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SLIDE-IN EDITING DETAIL PANEL */}
      {activeTask && (
        <div style={{
          width: '320px',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          flexShrink: 0,
          borderRadius: 'var(--radius-md) 0 0 var(--radius-md)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>TASK PROPERTIES</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => {
                  if(confirm("Delete task?")) {
                    deleteTask(activeTask.id);
                    setSelectedTaskId(null);
                  }
                }}
                style={{ color: 'var(--accent-calendar)', padding: '4px' }}
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
              <button onClick={() => setSelectedTaskId(null)} style={{ color: 'var(--text-muted)', padding: '4px' }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Title Editor */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>TITLE</label>
            <input
              type="text"
              value={activeTask.title}
              onChange={(e) => updateTask(activeTask.id, { title: e.target.value })}
              style={{ fontSize: '0.9rem' }}
            />
          </div>

          {/* Settings Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <select
                value={activeTask.status}
                onChange={(e) => updateTask(activeTask.id, { status: e.target.value })}
                style={{ width: '130px', padding: '4px' }}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Priority:</span>
              <select
                value={activeTask.priority}
                onChange={(e) => updateTask(activeTask.id, { priority: e.target.value })}
                style={{ width: '130px', padding: '4px' }}
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Deadline:</span>
              <input
                type="date"
                value={activeTask.dueDate || ''}
                onChange={(e) => updateTask(activeTask.id, { dueDate: e.target.value || null })}
                style={{ width: '130px', padding: '2px 4px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Domain:</span>
              <select
                value={activeTask.domainId || ''}
                onChange={(e) => updateTask(activeTask.id, { domainId: e.target.value || null })}
                style={{ width: '130px', padding: '4px' }}
              >
                <option value="">None</option>
                {domains.map(d => (
                  <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subtasks checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>CHECKLIST</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
              {(activeTask.subtasks || []).map(sub => (
                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                  <input
                    type="checkbox"
                    checked={sub.done}
                    onChange={() => toggleSubtask(sub.id)}
                    style={{ width: 'auto' }}
                  />
                  <span style={{ textDecoration: sub.done ? 'line-through' : 'none', color: sub.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <input
                type="text"
                placeholder="+ New item..."
                value={subtaskText}
                onChange={(e) => setSubtaskText(e.target.value)}
                style={{ fontSize: '0.75rem', padding: '4px 6px' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                Add
              </button>
            </form>
          </div>

          {/* Pomodoro logging */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>TIME LOGGED</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <Clock size={16} />
              <span>
                {activeTask.timeLogs ? Math.round(activeTask.timeLogs.reduce((sum, l) => sum + l.duration, 0)) : 0} minutes total
              </span>
            </div>

            <form onSubmit={handleLogTime} style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <input
                type="number"
                placeholder="Log minutes manually..."
                value={timeLogMins}
                onChange={(e) => setTimeLogMins(e.target.value)}
                style={{ fontSize: '0.75rem', padding: '4px 6px' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                Log
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
