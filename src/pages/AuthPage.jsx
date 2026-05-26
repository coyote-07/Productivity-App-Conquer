import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { KeyRound, Mail, User, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const { signUp, logIn, setActiveSection } = useWorkspace();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    if (isLogin) {
      logIn(email, password);
    } else {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      signUp(name, email, password);
    }
  };

  const handleGoogleOAuthMock = () => {
    // Generate a quick oauth login mock
    logIn(email || 'conqueror@gmail.com', 'google_mock_password');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0D0D0D',
      position: 'relative',
      padding: '1.5rem'
    }}>
      {/* Background grids */}
      <div className="hero-grid" />

      {/* Main Glass Card */}
      <div 
        className="card active-dashboard"
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '2.5rem 2rem',
          backgroundColor: '#161616',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.8)',
          zIndex: 10,
          textAlign: 'center'
        }}
      >
        {/* App Emblem */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'var(--accent-ai-gradient)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.3rem',
          marginBottom: '1rem'
        }}>
          C
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {isLogin ? 'Welcome back' : 'Start your conquest'}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          {isLogin ? 'Log in to access your command center.' : 'Sign up to build your custom workspace.'}
        </p>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#F87171',
            padding: '8px 12px',
            fontSize: '0.8rem',
            textAlign: 'left',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                YOUR NAME
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '0.65rem', fontWeight: '600', width: '100%', marginTop: '0.5rem' }}
          >
            {isLogin ? 'Log In to Conquer' : 'Start Free Workspace'}
          </button>
        </form>

        {/* Separator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '1.25rem 0',
          color: 'var(--text-muted)',
          fontSize: '0.75rem'
        }}>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span>OR CONTINUE WITH</span>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Google OAuth Mock */}
        <button
          onClick={handleGoogleOAuthMock}
          className="btn-secondary"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            padding: '0.6rem'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google Account
        </button>

        {/* Toggle Switch */}
        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              marginLeft: '6px',
              color: 'var(--accent-color)',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Create one now' : 'Sign in here'}
          </button>
        </div>

        {/* Cancel/Back */}
        <button
          onClick={() => setActiveSection('landing')}
          style={{
            marginTop: '1.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textDecoration: 'underline'
          }}
        >
          Cancel & Go Back
        </button>
      </div>
    </div>
  );
}
