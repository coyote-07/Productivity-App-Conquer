import React, { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import SpotlightSearch from './components/SpotlightSearch';
import LevelUpOverlay from './components/LevelUpOverlay';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Domains from './pages/Domains';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import CalendarView from './pages/CalendarView';
import GoalsHabits from './pages/GoalsHabits';
import Databases from './pages/Databases';
import Templates from './pages/Templates';
import AiAssistantPage from './pages/AiAssistantPage';
import Settings from './pages/Settings';

// Icons
import { Bell, HelpCircle, Menu, PanelRight, Sparkles } from 'lucide-react';

function AppContent() {
  const {
    user,
    activeSection,
    setActiveSection,
    rightPanelCollapsed,
    setRightPanelCollapsed,
    sidebarCollapsed,
    setSidebarCollapsed,
    notifications,
    markAllNotificationsAsRead,
    celebrationToast
  } = useWorkspace();

  const [notifOpen, setNotifOpen] = useState(false);

  // Landing, Auth, and Onboarding are full-screen layouts
  if (activeSection === 'landing') return <LandingPage />;
  if (activeSection === 'auth') return <AuthPage />;
  if (activeSection === 'onboarding') return <Onboarding />;

  // Render active section component
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'domains': return <Domains />;
      case 'notes': return <Notes />;
      case 'tasks': return <Tasks />;
      case 'kanban': return <Kanban />;
      case 'calendar': return <CalendarView />;
      case 'goals-habits': return <GoalsHabits />;
      case 'databases': return <Databases />;
      case 'templates': return <Templates />;
      case 'ai': return <AiAssistantPage />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const getSectionTitle = () => {
    if (activeSection === 'goals-habits') return 'Goals & Habits';
    if (activeSection === 'ai') return 'AI Assistant';
    return activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
  };

  const unreadNotifs = notifications.filter(n => n.unread).length;

  return (
    <div className={`app-wrapper active-${activeSection}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content grid */}
      <div className="main-layout">
        
        {/* Main Work Area */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden' }}>
          
          {/* Top Header Navbar */}
          <header style={{
            height: '56px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            flexShrink: 0,
            zIndex: 30
          }}>
            {/* Left section: breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {sidebarCollapsed && (
                <button 
                  onClick={() => setSidebarCollapsed(false)}
                  className="btn-ghost" 
                  style={{ padding: '6px', borderRadius: '4px' }}
                >
                  <Menu size={18} />
                </button>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user?.activeWorkspace}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/</span>
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {getSectionTitle()}
              </span>
            </div>

            {/* Right section: actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              
              {/* Level XP pill indicator */}
              <div 
                onClick={() => setActiveSection('goals-habits')}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  backgroundColor: 'var(--accent-bg-subtle)',
                  color: 'var(--accent-color)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid var(--accent-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={12} />
                <span>Level {user?.level}</span>
              </div>

              {/* Notification bell dropdown trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    if (!notifOpen) markAllNotificationsAsRead();
                  }}
                  className="btn-ghost"
                  style={{ padding: '6px', borderRadius: '4px', position: 'relative' }}
                >
                  <Bell size={18} />
                  {unreadNotifs > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-calendar)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {unreadNotifs}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown panel */}
                {notifOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '36px',
                    right: '0',
                    width: '280px',
                    maxHeight: '300px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    zIndex: 100,
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--border-color)',
                      padding: '4px 8px 8px',
                      marginBottom: '6px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>FEED NOTIFICATIONS</span>
                      <button onClick={() => setNotifOpen(false)} style={{ color: 'var(--text-muted)' }}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          style={{
                            padding: '6px 8px',
                            backgroundColor: 'var(--bg-app)',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{n.title}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '2px' }}>{n.content}</div>
                        </div>
                      ))}

                      {notifications.length === 0 && (
                        <div style={{ color: 'var(--text-muted)', padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontStyle: 'italic' }}>
                          No alerts log.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right panel toggle */}
              <button
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                className="btn-ghost"
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  color: !rightPanelCollapsed ? 'var(--accent-color)' : 'var(--text-secondary)',
                  backgroundColor: !rightPanelCollapsed ? 'var(--accent-bg-subtle)' : 'transparent'
                }}
                title="Toggle Right Panel"
              >
                <PanelRight size={18} />
              </button>

            </div>
          </header>

          {/* Page Canvas Container */}
          <div className="content-container">
            {renderContent()}
          </div>
        </div>

        {/* Right context panel */}
        <RightPanel />
      </div>

      {/* Action / Celebration Toasts alerts */}
      {celebrationToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 1000,
          backgroundColor: 'var(--accent-color)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 200ms ease-out'
        }}>
          <Sparkles size={16} fill="currentColor" />
          <span>{celebrationToast}</span>
        </div>
      )}

      {/* Global Modals */}
      <SpotlightSearch />
      <LevelUpOverlay />
    </div>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
