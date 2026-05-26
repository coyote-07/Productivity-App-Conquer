import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Search, FileText, CheckSquare, Globe, Database, Settings, CornerDownLeft } from 'lucide-react';

export default function SpotlightSearch() {
  const {
    searchOpen,
    setSearchOpen,
    notes,
    tasks,
    domains,
    databases,
    setActiveSection,
    setSelectedNoteId,
    setSelectedDomainId,
    setSelectedTaskId
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Monitor keyboard shortcuts globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Autofocus input when opened
  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      // Recent pages / Default view
      const defaultItems = [
        ...notes.slice(0, 3).map(n => ({ type: 'note', id: n.id, title: n.title, icon: FileText, category: 'Pages' })),
        ...domains.slice(0, 2).map(d => ({ type: 'domain', id: d.id, title: d.name, icon: Globe, category: 'Domains' })),
        { type: 'section', id: 'settings', title: 'Workspace Settings', icon: Settings, category: 'System' }
      ];
      setResults(defaultItems);
      return;
    }

    const q = query.toLowerCase();
    const matches = [];

    // Search Notes
    notes.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        matches.push({ type: 'note', id: n.id, title: n.title, icon: FileText, category: 'Pages', subtitle: 'Notes & Docs' });
      }
    });

    // Search Tasks
    tasks.forEach(t => {
      if (t.title.toLowerCase().includes(q)) {
        matches.push({ type: 'task', id: t.id, title: t.title, icon: CheckSquare, category: 'Tasks', subtitle: t.status });
      }
    });

    // Search Domains
    domains.forEach(d => {
      if (d.name.toLowerCase().includes(q)) {
        matches.push({ type: 'domain', id: d.id, title: d.name, icon: Globe, category: 'Domains' });
      }
    });

    // Search Databases
    databases.forEach(db => {
      if (db.name.toLowerCase().includes(q)) {
        matches.push({ type: 'database', id: db.id, title: db.name, icon: Database, category: 'Databases' });
      }
    });

    setResults(matches);
    setSelectedIndex(0);
  }, [query, notes, tasks, domains, databases]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectItem(results[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item) => {
    setSearchOpen(false);
    
    if (item.type === 'note') {
      setActiveSection('notes');
      setSelectedNoteId(item.id);
    } else if (item.type === 'domain') {
      setActiveSection('domains');
      setSelectedDomainId(item.id);
    } else if (item.type === 'task') {
      setActiveSection('tasks');
      setSelectedTaskId(item.id);
    } else if (item.type === 'database') {
      setActiveSection('databases');
    } else if (item.type === 'section') {
      setActiveSection(item.id);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setSearchOpen(false)} style={{ animation: 'fadeIn 100ms ease-out' }}>
      <div 
        className="modal-content spotlight-modal" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          border: '1px solid var(--border-focus)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 10px 10px -5px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Input */}
        <div className="spotlight-input-container">
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            className="spotlight-input"
            placeholder="Search notes, tasks, domains, or settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="spotlight-results">
          {results.length > 0 ? (
            <div>
              {/* Group headings logic */}
              {['Pages', 'Domains', 'Tasks', 'Databases', 'System'].map(group => {
                const groupItems = results.filter(item => item.category === group);
                if (groupItems.length === 0) return null;
                
                return (
                  <div key={group} className="spotlight-result-group">
                    <div className="spotlight-group-title">{group}</div>
                    {groupItems.map(item => {
                      // Find item absolute index in flat list
                      const absoluteIndex = results.indexOf(item);
                      const isSelected = absoluteIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id + '_' + item.type}
                          className={`spotlight-item ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSelectItem(item)}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          style={{
                            backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Icon size={16} style={{ color: isSelected ? 'var(--accent-color)' : 'var(--text-muted)' }} />
                            <div>
                              <div>{item.title}</div>
                              {item.subtitle && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                  {item.subtitle}
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              Go
                              <CornerDownLeft size={10} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No results found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-surface)'
        }}>
          <div>
            Use <kbd style={{ background: 'var(--bg-app)', padding: '2px 4px', borderRadius: '4px' }}>↑↓</kbd> to navigate
          </div>
          <div>
            Press <kbd style={{ background: 'var(--bg-app)', padding: '2px 4px', borderRadius: '4px' }}>Enter</kbd> to open
          </div>
        </div>
      </div>
    </div>
  );
}
