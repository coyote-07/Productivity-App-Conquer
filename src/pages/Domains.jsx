import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Globe, LayoutGrid, List, Plus, 
  Trash2, ExternalLink, HelpCircle, FileText, 
  Clock, CheckSquare, MessageSquare, Tag, Eye 
} from 'lucide-react';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
];

export default function Domains() {
  const {
    domains,
    addDomain,
    updateDomain,
    deleteDomain,
    selectedDomainId,
    setSelectedDomainId,
    addComment,
    tasks
  } = useWorkspace();

  const [viewMode, setViewMode] = useState('gallery'); // gallery, list
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainIcon, setNewDomainIcon] = useState('🧠');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Inside domain database tabs
  const [dbTab, setDbTab] = useState('topics'); // topics, review, assignments
  const [newRowName, setNewRowName] = useState('');
  const [commentText, setCommentText] = useState('');

  // Default database columns
  const dbData = {
    topics: [
      { id: 1, name: 'Welcome & Core Principles', date: '2026-05-10', due: '2026-05-20', status: 'done' },
      { id: 2, name: 'Daily Habit Setup Matrix', date: '2026-05-15', due: '2026-05-28', status: 'in progress' },
      { id: 3, name: 'Workload Delegation Strategies', date: '2026-05-22', due: '2026-06-05', status: 'not started' }
    ],
    review: [
      { id: 1, name: 'Weekly System Reflection Q1', date: '2026-05-01', due: '2026-05-02', status: 'done' },
      { id: 2, name: 'Habit Analytics Audit', date: '2026-05-18', due: '2026-05-19', status: 'done' }
    ],
    assignments: [
      { id: 1, name: 'Submit Portfolio Mockups', date: '2026-05-23', due: '2026-05-24', status: 'in progress' },
      { id: 2, name: 'Draft Launch Release Notes', date: '2026-05-24', due: '2026-05-27', status: 'not started' }
    ]
  };

  const [localDb, setLocalDb] = useState(dbData);

  const handleCreateDomain = (e) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;
    const randomCover = PRESET_COVERS[Math.floor(Math.random() * PRESET_COVERS.length)];
    addDomain(newDomainName, randomCover, newDomainIcon);
    setNewDomainName('');
    setShowCreateModal(false);
  };

  const handleAddDbRow = (e) => {
    e.preventDefault();
    if (!newRowName.trim()) return;
    
    const newRow = {
      id: Date.now(),
      name: newRowName,
      date: new Date().toISOString().split('T')[0],
      due: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'not started'
    };

    setLocalDb(prev => ({
      ...prev,
      [dbTab]: [...prev[dbTab], newRow]
    }));
    setNewRowName('');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment('domain', selectedDomainId, commentText);
    setCommentText('');
  };

  const activeDomain = domains.find(d => d.id === selectedDomainId);

  // If a domain is selected, render the inside page
  if (activeDomain) {
    const domainTasks = tasks.filter(t => t.domainId === activeDomain.id);
    const domainComments = activeDomain.comments || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.5rem', paddingBottom: '3rem' }}>
        
        {/* Banner Cover Image */}
        <div style={{
          position: 'relative',
          height: '180px',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundImage: `url(${activeDomain.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border-color)'
        }}>
          {/* Subtle gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)'
          }} />
          
          {/* Back button */}
          <button
            onClick={() => setSelectedDomainId(null)}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '0.8rem',
              padding: '6px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(4px)'
            }}
          >
            ← Back to Domains
          </button>

          {/* Quick Edit Cover Option */}
          <button
            onClick={() => {
              const currentIdx = PRESET_COVERS.indexOf(activeDomain.cover);
              const nextIdx = (currentIdx + 1) % PRESET_COVERS.length;
              updateDomain(activeDomain.id, { cover: PRESET_COVERS[nextIdx] });
            }}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)'
            }}
          >
            Change Cover
          </button>
        </div>

        {/* Header Metadata Overlapping Banner */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '-40px', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
          {/* Domain Icon Overlay */}
          <button 
            onClick={() => {
              const icons = ['🧠', '🌐', '💼', '🏡', '🏋️', '📚', '🎨', '🚀'];
              const curIdx = icons.indexOf(activeDomain.icon);
              const nextIdx = (curIdx + 1) % icons.length;
              updateDomain(activeDomain.id, { icon: icons[nextIdx] });
            }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '4px solid var(--bg-app)',
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
            title="Click to toggle icon"
          >
            {activeDomain.icon}
          </button>
          
          <div style={{ alignSelf: 'flex-end', textAlign: 'left', paddingBottom: '4px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {activeDomain.name}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Domain Reference ID: <code style={{ padding: '1px 4px', fontSize: '0.65rem' }}>{activeDomain.id}</code>
            </div>
          </div>
        </div>

        {/* Custom Properties Panel */}
        <div 
          className="card" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            textAlign: 'left',
            marginTop: '0.5rem'
          }}
        >
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>STATUS</label>
            <select
              value={activeDomain.status}
              onChange={(e) => updateDomain(activeDomain.id, { status: e.target.value })}
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>LINK</label>
            <input
              type="text"
              placeholder="Add website URL..."
              value={activeDomain.link}
              onChange={(e) => updateDomain(activeDomain.id, { link: e.target.value })}
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>TASK COUNT</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              <CheckSquare size={16} style={{ color: 'var(--accent-tasks)' }} />
              <span>{domainTasks.length} linked tasks</span>
            </div>
          </div>
        </div>

        {/* Database Views section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', textAlign: 'left' }}>
          {/* Tab selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1rem' }}>
            {['topics', 'review', 'assignments'].map(tab => (
              <button
                key={tab}
                onClick={() => setDbTab(tab)}
                style={{
                  padding: '8px 4px',
                  fontSize: '0.85rem',
                  fontWeight: dbTab === tab ? '600' : '400',
                  color: dbTab === tab ? 'var(--accent-color)' : 'var(--text-secondary)',
                  borderBottom: dbTab === tab ? `2px solid var(--accent-color)` : '2px solid transparent'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} View
              </button>
            ))}
          </div>

          {/* Table list */}
          <div className="db-table-container">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Date Created</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {localDb[dbTab].map(row => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{row.name}</td>
                    <td>{row.date}</td>
                    <td>{row.due}</td>
                    <td>
                      <span className={`badge badge-${row.status.replace(' ', '-')}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inline Entry Creation row */}
          <form onSubmit={handleAddDbRow} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <input
              type="text"
              placeholder={`+ New ${dbTab} row entry...`}
              value={newRowName}
              onChange={(e) => setNewRowName(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '6px 10px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Add Row
            </button>
          </form>
        </div>

        {/* Comments Thread Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
            💬 Comments Feed
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {domainComments.map(comment => (
              <div 
                key={comment.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{comment.user}</span>
                  <span>{new Date(comment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{comment.text}</div>
              </div>
            ))}

            {domainComments.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                No remarks posted. Start the conversation below.
              </div>
            )}
          </div>

          {/* Comment form */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="Add your thoughts or notes..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '6px 10px' }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Post
            </button>
          </form>
        </div>

      </div>
    );
  }

  // Otherwise, render domains gallery view
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.5rem', textAlign: 'left' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>🌐 Domains of Life</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Top level containers grouping your notes, projects, and daily tasks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {/* View Toggles */}
          <div style={{ display: 'flex', backgroundColor: 'var(--border-color)', padding: '2px', borderRadius: '6px' }}>
            <button
              onClick={() => setViewMode('gallery')}
              style={{
                padding: '4px 6px',
                borderRadius: '4px',
                backgroundColor: viewMode === 'gallery' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'gallery' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '4px 6px',
                borderRadius: '4px',
                backgroundColor: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              <List size={14} />
            </button>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={14} /> New Domain
          </button>
        </div>
      </div>

      {/* Domain Cards */}
      {viewMode === 'gallery' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginTop: '0.5rem'
        }}>
          {domains.map(dom => (
            <div
              key={dom.id}
              onClick={() => setSelectedDomainId(dom.id)}
              className="card accented active-domains"
              style={{
                height: '140px',
                padding: 0,
                cursor: 'pointer',
                backgroundImage: `url(${dom.cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative'
              }}
            >
              {/* Cover darkened overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.85) 100%)',
                zIndex: 1
              }} />

              {/* Delete button wrapper */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm("Delete this domain? Tasks will remain but lose domain binding.")) {
                    deleteDomain(dom.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '4px',
                  borderRadius: '4px',
                  color: 'var(--accent-calendar)'
                }}
                title="Delete Domain"
              >
                <Trash2 size={12} />
              </button>

              {/* Bottom text */}
              <div style={{
                position: 'relative',
                zIndex: 10,
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{dom.icon}</span>
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>
                  {dom.name}
                </span>
                
                {dom.comments && dom.comments.length > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.7rem',
                    background: 'rgba(255,255,255,0.15)',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <MessageSquare size={10} />
                    {dom.comments.length}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Empty ghost card builder */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="card"
            style={{
              height: '140px',
              border: '2px dashed var(--border-color)',
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              gap: '6px'
            }}
          >
            <Plus size={20} />
            <span style={{ fontSize: '0.85rem' }}>Add top container</span>
          </div>
        </div>
      ) : (
        /* List View Mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          {domains.map(dom => (
            <div
              key={dom.id}
              onClick={() => setSelectedDomainId(dom.id)}
              className="card"
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.25rem' }}>{dom.icon}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{dom.name}</span>
                <span className={`badge badge-${dom.status.replace(' ', '-')}`}>{dom.status}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm("Delete domain?")) deleteDomain(dom.id);
                  }}
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <form 
            onSubmit={handleCreateDomain}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '2rem', maxWidth: '400px' }}
          >
            <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Create New Life Domain</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  DOMAIN NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Health & Fitness, Finance"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  EMOJI ICON
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['🧠', '💼', '🏡', '🏋️', '📚', '🎨', '🚀', '💵'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewDomainIcon(emoji)}
                      style={{
                        fontSize: '1.25rem',
                        padding: '4px 8px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: newDomainIcon === emoji ? 'var(--border-focus)' : 'transparent'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Create Container
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
