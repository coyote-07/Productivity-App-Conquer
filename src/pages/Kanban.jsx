import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Plus, Calendar, CheckSquare, 
  Clock, MessageSquare, Tag, AlertCircle 
} from 'lucide-react';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#6B7280' },
  { id: 'todo', title: 'To Do', color: '#3B82F6' },
  { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'in-review', title: 'In Review', color: '#7C3AED' },
  { id: 'done', title: 'Done', color: '#10B981' }
];

export default function Kanban() {
  const {
    tasks,
    addTask,
    updateTask,
    domains,
    setSelectedTaskId
  } = useWorkspace();

  const [filterPriority, setFilterPriority] = useState('all');

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { status: columnId });
    }
  };

  // Filter logic
  const filteredTasks = tasks.filter(t => 
    filterPriority === 'all' || t.priority === filterPriority
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', height: '100%', textAlign: 'left' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>📋 Kanban Sprint Board</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Drag and drop task cards between stages.
          </p>
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FILTER BY PRIORITY:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ width: '120px', padding: '4px 8px', fontSize: '0.8rem' }}
          >
            <option value="all">All Items</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        alignItems: 'flex-start',
        overflowX: 'auto',
        flex: 1,
        minHeight: '450px'
      }}>
        {COLUMNS.map(col => {
          // Map tasks based on status
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {/* Column Title Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: col.color
                }} />
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {col.title}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--bg-app)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  color: 'var(--text-muted)',
                  marginLeft: 'auto'
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards inside column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
                {colTasks.map(t => {
                  const dom = domains.find(d => d.id === t.domainId);
                  const subDone = t.subtasks ? t.subtasks.filter(s => s.done).length : 0;
                  const subTotal = t.subtasks ? t.subtasks.length : 0;
                  const timeLogged = t.timeLogs ? Math.round(t.timeLogs.reduce((sum, l) => sum + l.duration, 0)) : 0;

                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="card accented active-kanban"
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-app)',
                        cursor: 'grab',
                        borderColor: 'var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      {/* Optional cover picture */}
                      {t.cover && (
                        <div style={{
                          height: '60px',
                          width: '100%',
                          backgroundImage: `url(${t.cover})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '4px',
                          marginBottom: '4px'
                        }} />
                      )}

                      {/* Header icon / title */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.3' }}>
                        {t.icon && <span>{t.icon}</span>}
                        <span style={{ flex: 1, textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>
                          {t.title}
                        </span>
                      </div>

                      {/* Domain Tag */}
                      {dom && (
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '0.65rem',
                            backgroundColor: 'rgba(124, 58, 237, 0.12)',
                            color: 'var(--accent-domains)',
                            padding: '1px 5px',
                            borderRadius: '4px'
                          }}>
                            {dom.icon} {dom.name}
                          </span>
                        </div>
                      )}

                      {/* Subtasks checklist gauge */}
                      {subTotal > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            <span>📋 {subDone}/{subTotal} subtasks</span>
                            <span>{Math.round((subDone / subTotal) * 100)}%</span>
                          </div>
                          <div style={{ width: '100%', height: '3px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${(subDone / subTotal) * 100}%`, height: '100%', backgroundColor: 'var(--accent-color)' }} />
                          </div>
                        </div>
                      )}

                      {/* Date & Time logged row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '6px',
                        marginTop: '4px'
                      }}>
                        {t.dueDate ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Calendar size={10} />
                            {t.dueDate}
                          </span>
                        ) : <span />}

                        {timeLogged > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Clock size={10} />
                            {timeLogged}m
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Card adder row button */}
              <button
                onClick={() => {
                  const title = prompt("Enter card title:");
                  if (title) {
                    addTask(title, null, null, 'medium', col.id);
                  }
                }}
                className="btn-ghost"
                style={{
                  fontSize: '0.8rem',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  color: 'var(--text-muted)'
                }}
              >
                <Plus size={14} /> Add card item
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}
