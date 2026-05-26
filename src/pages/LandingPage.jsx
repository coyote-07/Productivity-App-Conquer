import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { FileText, CheckSquare, Globe, Target, Grid, Sparkles, Heart } from 'lucide-react';

export default function LandingPage() {
  const { setActiveSection } = useWorkspace();

  const features = [
    { name: 'Notes & Docs', icon: FileText, desc: 'Rich wiki workspace for documents & sub-pages.', color: 'var(--accent-notes)' },
    { name: 'Tasks & Projects', icon: CheckSquare, desc: 'Track priorities, deadlines, and milestones.', color: 'var(--accent-tasks)' },
    { name: 'Domains of Life', icon: Globe, desc: 'Group projects, tasks, and notes by life domains.', color: 'var(--accent-domains)' },
    { name: 'Goals & Habits', icon: Target, desc: 'Daily streak metrics & milestones gamification.', color: 'var(--accent-goals)' },
    { name: 'Kanban Boards', icon: Grid, desc: 'Drag-and-drop card pipelines with time loggers.', color: 'var(--accent-kanban)' },
    { name: 'AI Workspace Assistant', icon: Sparkles, desc: 'Semantic search, auto tagger & summaries.', color: '#8B5CF6' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowY: 'auto',
      backgroundColor: '#0D0D0D',
      color: '#fff'
    }}>
      {/* Grid texture overlay */}
      <div className="hero-grid" />

      {/* Top Navbar */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
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
            color: '#fff'
          }}>
            C
          </span>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.03em' }}>
            CONQUER
          </span>
        </div>

        <button 
          onClick={() => setActiveSection('auth')} 
          className="btn-secondary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
        >
          Log In
        </button>
      </header>

      {/* Hero Section */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          color: 'var(--accent-dashboard)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          <span>🚀 v1.0 Launch — Free Forever</span>
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          lineHeight: '1.1',
          letterSpacing: '-0.04em',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #FFFFFF, #9CA3AF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Conquer your day.<br />Master your life.
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#9CA3AF',
          marginBottom: '2rem',
          lineHeight: '1.6',
          maxWidth: '600px'
        }}>
          The all-in-one workspace for tasks, goals, notes, habits, and life domains. Handcrafted in beautiful dark mode.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3.5rem' }}>
          <button 
            onClick={() => setActiveSection('auth')} 
            className="btn-primary active-dashboard"
            style={{ padding: '0.75rem 1.75rem', fontWeight: '600', borderRadius: 'var(--radius-md)', fontSize: '0.95rem' }}
          >
            Get started for free
          </button>
          <button 
            onClick={() => setActiveSection('auth')} 
            className="btn-secondary"
            style={{ padding: '0.75rem 1.75rem', fontWeight: '600', borderRadius: 'var(--radius-md)', fontSize: '0.95rem' }}
          >
            Explore Demo
          </button>
        </div>

        {/* Float Screenshot Showcase */}
        <div style={{
          width: '100%',
          maxWidth: '750px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #262626',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(245, 158, 11, 0.05)',
          overflow: 'hidden',
          backgroundColor: '#161616',
          aspectRatio: '16/10',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left'
        }}>
          {/* Mock Window Bar */}
          <div style={{
            padding: '10px 16px',
            backgroundColor: '#0D0D0D',
            borderBottom: '1px solid #262626',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: '0.7rem', color: '#6B7280', marginLeft: '12px', fontFamily: 'var(--font-mono)' }}>
              conquer.app/dashboard
            </span>
          </div>

          {/* Mock Screen Content */}
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#9CA3AF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>Good Morning, Conqueror 👋</div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                Lvl 2 · XP 240/1000
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', flex: 1 }}>
              {/* Left Mock Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: '#222', padding: '12px', borderRadius: '8px', border: '1px solid #333' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>🎯 Today's Focus</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" readOnly checked /> <s>Review project brief docs</s></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" readOnly /> Code responsive dark theme layout</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" readOnly /> Check in daily hydration habit</div>
                  </div>
                </div>
              </div>

              {/* Right Mock Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: '#222', padding: '12px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>⏱️ Pomodoro</div>
                  <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#F59E0B', fontWeight: 'bold' }}>21:42</div>
                  <div style={{ fontSize: '0.6rem', color: '#6B7280', marginTop: '2px' }}>FOCUSING: Dark Mode Styles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Strip */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid #262626',
        backgroundColor: '#0D0D0D',
        padding: '4rem 2rem 5rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Everything you need, in one command center.</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Ditch multiple subscriptions. Keep work, study, and life consolidated.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div 
                  key={i} 
                  className="card"
                  style={{
                    backgroundColor: '#161616',
                    border: '1px solid #262626',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: f.color,
                    marginBottom: '1rem'
                  }}>
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#fff' }}>{f.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid #262626',
        backgroundColor: '#0D0D0D',
        padding: '2rem',
        textAlign: 'center',
        color: '#6B7280',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
          <span>CONQUER © 2026 · Built with</span>
          <Heart size={12} style={{ color: 'var(--accent-calendar)' }} />
          <span>for high performers.</span>
        </div>
        <div>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
            GitHub Link
          </a>
        </div>
      </footer>
    </div>
  );
}
