import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Settings as SettingsIcon, ShieldAlert, Sparkles, 
  Globe, Mail, Music, Terminal 
} from 'lucide-react';

export default function Settings() {
  const {
    user,
    setUser,
    integrations,
    toggleIntegration,
    showToast
  } = useWorkspace();

  const [newName, setNewName] = useState(user?.name || '');
  const [newWorkspace, setNewWorkspace] = useState(user?.activeWorkspace || '');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newWorkspace.trim()) return;

    setUser(prev => ({
      ...prev,
      name: newName,
      activeWorkspace: newWorkspace
    }));
    showToast("Profile Settings Saved!");
  };

  const handleClearCache = () => {
    if (confirm("Reset Workspace? This will wipe all tasks, notes, and domains and start fresh.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const integrationList = [
    { key: 'googleCalendar', name: 'Google Calendar & Drive', desc: 'Sync events, browse files, and attach slides.', icon: Globe, color: '#4285F4' },
    { key: 'github', name: 'GitHub Sync Issues', desc: 'Map commit PRs and review sprint issues.', icon: Terminal, color: '#24292e' },
    { key: 'notion', name: 'Notion Importer Zip', desc: 'Duplicates structures, markdown wikis, and DB schemas.', icon: Globe, color: '#000000' },
    { key: 'gmail', name: 'Gmail Inbox forwarding', desc: 'Transform client emails into tasks or text files.', icon: Mail, color: '#EA4335' },
    { key: 'spotify', name: 'Spotify Premium player', desc: 'Launches focus tracks synchronized to Pomodoro.', icon: Music, color: '#1DB954' }
  ];

  if (!user) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', width: '100%', height: '100%', textAlign: 'left', paddingBottom: '3rem' }}>
      
      {/* LEFT COLUMN: SETTINGS PANELS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Page Header */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>⚙️ Workspace Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Configure integrations, manage profile credentials, and reset caches.
          </p>
        </div>

        {/* Profile Settings form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
            User & Workspace Details
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  YOUR DISPLAY NAME
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  WORKSPACE COMMAND NAME
                </label>
                <input
                  type="text"
                  value={newWorkspace}
                  onChange={(e) => setNewWorkspace(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: '0.85rem' }}>
              Save Details
            </button>
          </form>
        </div>

        {/* Integrations checklist */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
            Connected API Integrations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {integrationList.map(item => {
              const Icon = item.icon;
              const isConnected = integrations[item.key];

              return (
                <div 
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleIntegration(item.key)}
                    className="btn"
                    style={{
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface)',
                      border: isConnected ? '1px solid rgb(16, 185, 129)' : '1px solid var(--border-color)',
                      color: isConnected ? 'rgb(16, 185, 129)' : 'var(--text-secondary)'
                    }}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: CRITICAL OPERATIONS */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-calendar)', fontWeight: 'bold', fontSize: '0.8rem' }}>
          <ShieldAlert size={16} />
          <span>DANGER ZONE</span>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
          Warning: Resetting your workspace is irreversible. This will clear the local mock database and reload standard setups.
        </p>

        <button
          onClick={handleClearCache}
          className="btn"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgb(239, 68, 68)',
            color: 'rgb(239, 68, 68)',
            fontSize: '0.8rem',
            padding: '6px',
            width: '100%',
            fontWeight: '600',
            marginTop: '0.5rem'
          }}
        >
          Reset Workspace Data
        </button>
      </div>

    </div>
  );
}
