import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Award, Sparkles } from 'lucide-react';

export default function LevelUpOverlay() {
  const { levelUpToast, setLevelUpToast } = useWorkspace();

  if (!levelUpToast) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 200, animation: 'fadeIn 200ms ease-out' }}>
      <div 
        className="modal-content level-up-celebrate"
        style={{
          maxWidth: '420px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          alignItems: 'center',
          background: 'radial-gradient(circle at top, rgba(124, 58, 237, 0.15) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--accent-domains)',
          boxShadow: '0 0 40px rgba(124, 58, 237, 0.25)'
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--accent-ai-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <Award size={40} />
          <Sparkles size={18} style={{ position: 'absolute', top: '-5px', right: '-5px', color: '#F59E0B' }} />
        </div>

        <div style={{
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: 'var(--accent-domains)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '0.5rem'
        }}>
          Level Up Achieved!
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          LEVEL {levelUpToast.level}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', fontStyle: 'italic' }}>
          "{levelUpToast.message}"
        </p>

        <button
          onClick={() => setLevelUpToast(null)}
          className="btn-primary"
          style={{
            background: 'var(--accent-ai-gradient)',
            width: '100%',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          Continue Conquering
        </button>
      </div>
    </div>
  );
}
