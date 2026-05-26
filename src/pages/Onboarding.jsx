import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  User, Compass, Sparkles, Plus, Search, 
  Settings, CheckSquare, Target, Cpu, 
  TrendingUp, Users, Heart 
} from 'lucide-react';

export default function Onboarding() {
  const { user, completeOnboarding } = useWorkspace();
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState('Personal productivity');
  const [wsName, setWsName] = useState('');
  
  // Tour step state
  const [tourStep, setTourStep] = useState(0);

  const useCases = [
    { name: 'Personal productivity', icon: Compass, desc: 'Organize day-to-day tasks, life goals, habits, and journal entries.' },
    { name: 'Student & learning', icon: Compass, desc: 'Manage homework, lectures, research wikis, and exam study calendars.' },
    { name: 'Project & team management', icon: Users, desc: 'Track task pipelines, assignees, sprints, and team documentation.' },
    { name: 'Health & fitness tracking', icon: Heart, desc: 'Set fitness goals, track hydration habits, and log workout plans.' },
    { name: 'Business & work', icon: TrendingUp, desc: 'Coordinate projects, client invoices, meetings, and business specs.' },
    { name: 'Engineering & dev work', icon: Cpu, desc: 'Track bugs, document architectures, review checklists, and connect repos.' }
  ];

  const handleNext = () => {
    if (step === 2) {
      // Step 3 is a fast pre-fill loader screen that auto-triggers step 4
      setStep(3);
      setTimeout(() => {
        setStep(4);
        setTourStep(1);
      }, 1500);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleFinishOnboarding = () => {
    completeOnboarding(useCase, wsName || `${user?.name || 'My'}'s Workspace`);
  };

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0D0D0D',
      position: 'relative',
      padding: '2rem'
    }}>
      <div className="hero-grid" />

      {/* STEP 1: WELCOME & USE CASE */}
      {step === 1 && (
        <div className="card active-dashboard" style={{ maxWidth: '680px', width: '100%', padding: '2.5rem', zIndex: 10, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Welcome to Conquer, {user.name} 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            To tailor your command center, tell us: What will you use Conquer for?
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            maxHeight: '360px',
            overflowY: 'auto',
            padding: '4px',
            textAlign: 'left'
          }}>
            {useCases.map((uc) => {
              const Icon = uc.icon;
              const isSelected = useCase === uc.name;
              return (
                <div
                  key={uc.name}
                  onClick={() => setUseCase(uc.name)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-color)' : 'var(--border-color)',
                    backgroundColor: isSelected ? 'var(--accent-bg-subtle)' : 'var(--bg-surface)',
                    padding: '1rem',
                    transition: 'all 150ms'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Icon size={18} style={{ color: isSelected ? 'var(--accent-color)' : 'var(--text-secondary)' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>{uc.name}</h3>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{uc.desc}</p>
                </div>
              );
            })}
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: '600' }}>
            Continue
          </button>
        </div>
      )}

      {/* STEP 2: WORKSPACE SETUP */}
      {step === 2 && (
        <div className="card active-dashboard" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', zIndex: 10 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>
            Set up your workspace
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'center' }}>
            Give your command center a name. You can invite team members later.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                WORKSPACE NAME
              </label>
              <input
                type="text"
                placeholder="e.g. My Command Center"
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                WORKSPACE AVATAR (OPTIONAL)
              </label>
              <div style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '0.8rem'
              }}>
                <Compass size={24} style={{ margin: '0 auto 8px', color: 'var(--text-secondary)' }} />
                <span>Drag & drop image, or click to browse</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: '0.65rem' }}>
              Back
            </button>
            <button onClick={handleNext} className="btn-primary" style={{ flex: 2, padding: '0.65rem', fontWeight: '600' }}>
              Build Workspace
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MOCK GENERATOR SCREEN */}
      {step === 3 && (
        <div className="card active-dashboard" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem', zIndex: 10, textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-color)',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>Generating Workspace</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.6' }}>
            Creating default Life Domain...<br />
            Pre-filling tasks & templates...<br />
            Configuring dashboard widgets...
          </p>
        </div>
      )}

      {/* STEP 4: QUICK TOUR TOOLTIPS */}
      {step === 4 && (
        <div className="card active-dashboard" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', zIndex: 10, textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-dashboard)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={20} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Quick Workspace Tour
          </h2>

          {tourStep === 1 && (
            <div style={{ margin: '1.5rem 0' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                1. Left Sidebar Navigation
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Access all your pages, calendars, kanbans, templates, and settings. Hover to collapse it into icon-only mode to maximize workspace size.
              </p>
            </div>
          )}

          {tourStep === 2 && (
            <div style={{ margin: '1.5rem 0' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                2. Command Spotlight search (Cmd+K)
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Press <code>Cmd+K</code> anywhere to open the spotlight modal. Search, navigate, or create new elements globally at lightning speed.
              </p>
            </div>
          )}

          {tourStep === 3 && (
            <div style={{ margin: '1.5rem 0' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                3. Right Context Panel
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Toggle the Pomodoro timer, chat with the AI assistant, play Spotify focus music, or inspect metadata attributes on open wiki documents.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Step {tourStep} of 3
            </span>
            {tourStep < 3 ? (
              <button
                onClick={() => setTourStep(prev => prev + 1)}
                className="btn-primary"
                style={{ padding: '0.5rem 1.25rem', fontWeight: '600' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleFinishOnboarding}
                className="btn-primary"
                style={{
                  background: 'var(--accent-ai-gradient)',
                  padding: '0.55rem 1.5rem',
                  fontWeight: '700'
                }}
              >
                Start Conquering!
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
