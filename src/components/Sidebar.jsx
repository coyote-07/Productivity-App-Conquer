import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Home, Globe, CheckSquare, Grid, Calendar, FileText, 
  Target, Database, Layout, Sparkles, Settings, 
  ChevronLeft, ChevronRight, Search, Sun, Moon, LogOut 
} from 'lucide-react';

export default function Sidebar() {
  const {
    user,
    activeSection,
    setActiveSection,
    sidebarCollapsed,
    setSidebarCollapsed,
    setSearchOpen,
    toggleTheme,
    logOut
  } = useWorkspace();

  if (!user) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'var(--accent-dashboard)' },
    { id: 'domains', label: 'Domains', icon: Globe, color: 'var(--accent-domains)' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'var(--accent-tasks)' },
    { id: 'kanban', label: 'Kanban Board', icon: Grid, color: 'var(--accent-kanban)' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'var(--accent-calendar)' },
    { id: 'notes', label: 'Notes & Docs', icon: FileText, color: 'var(--accent-notes)' },
    { id: 'goals-habits', label: 'Goals & Habits', icon: Target, color: 'var(--accent-goals)' },
    { id: 'databases', label: 'Databases', icon: Database, color: 'var(--accent-databases)' },
    { id: 'templates', label: 'Templates', icon: Layout, color: 'var(--accent-templates)' },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, color: 'var(--accent-domains)' }
  ];

  const currentLevelXP = user.level * 500;
  const xpPercent = Math.min((user.xp / currentLevelXP) * 100, 100);

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* App Logo & Workspace */}
      <div style={{
        padding: '1.25rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        {!sidebarCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: 'var(--accent-ai-gradient)',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: '#fff',
              fontSize: '1rem',
              letterSpacing: '-0.05em'
            }}>
              C
            </span>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              CONQUER
            </span>
          </div>
        ) : (
          <span style={{
            background: 'var(--accent-ai-gradient)',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            color: '#fff',
            fontSize: '1rem',
            margin: '0 auto'
          }}>
            C
          </span>
        )}

        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="btn-ghost"
          style={{ padding: '4px', borderRadius: '4px' }}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search Bar Trigger */}
      <div style={{ padding: '0.75rem 1rem' }}>
        {sidebarCollapsed ? (
          <button 
            onClick={() => setSearchOpen(true)}
            className="btn-secondary"
            style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'center' }}
            title="Search (Cmd+K)"
          >
            <Search size={16} />
          </button>
        ) : (
          <button 
            onClick={() => setSearchOpen(true)}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              textAlign: 'left'
            }}
          >
            <Search size={14} />
            <span>Search...</span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.7rem',
              background: 'var(--border-color)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              ⌘K
            </span>
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                backgroundColor: isActive ? 'var(--accent-bg-subtle)' : 'transparent',
                color: isActive ? item.color : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '400',
                borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                textAlign: 'left',
                transition: 'all 150ms'
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={18} style={{ color: isActive ? item.color : 'var(--text-secondary)', flexShrink: 0 }} />
              {!sidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Workspace Indicator & User Level Footer */}
      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Workspace Display */}
        {!sidebarCollapsed && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span>CURRENT WORKSPACE</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
              {user.activeWorkspace}
            </span>
          </div>
        )}

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-ai-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            flexShrink: 0
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  backgroundColor: 'var(--accent-color)',
                  color: '#fff',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  lineHeight: '1'
                }}>
                  Lvl {user.level}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.xp}/{currentLevelXP} XP
                </span>
              </div>
            </div>
          )}
        </div>

        {/* XP Level Progress Bar */}
        {!sidebarCollapsed && (
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${xpPercent}%`,
              height: '100%',
              backgroundColor: 'var(--accent-color)',
              transition: 'width 250ms'
            }} />
          </div>
        )}

        {/* Action Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          gap: '0.5rem',
          marginTop: '0.25rem'
        }}>
          <button 
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '4px' }}
            title={user.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {user.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          
          {!sidebarCollapsed && (
            <>
              <button 
                onClick={() => setActiveSection('settings')}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '4px' }}
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button 
                onClick={logOut}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '4px', color: 'var(--accent-calendar)' }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
