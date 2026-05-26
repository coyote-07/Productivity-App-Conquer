import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Music, Play, Pause, SkipForward, SkipBack, Lock } from 'lucide-react';

const FOCUS_PLAYLISTS = [
  { id: 'pl_1', name: 'Lofi Workspace Beats', tracks: ['Focus Flow', 'Late Night Coding', 'Warm Coffee', 'Chill Vibes'], art: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80' },
  { id: 'pl_2', name: 'Ambient Focus Space', tracks: ['Deep Cosmos', 'Neural Pathway', 'Liquid Mind', 'Alpha Waves'], art: 'https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=200&q=80' },
  { id: 'pl_3', name: 'Synthwave Conquer', tracks: ['Neon Grid', 'Overdrive', 'Laser Highway', 'Digital Sun'], art: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80' }
];

export default function SpotifyWidget() {
  const {
    integrations,
    toggleIntegration,
    pomodoro
  } = useWorkspace();

  const [activePlaylist, setActivePlaylist] = useState(FOCUS_PLAYLISTS[0]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30); // 30%

  // Auto-play Spotify focus playlist when Pomodoro session starts
  useEffect(() => {
    if (integrations.spotify && pomodoro.status === 'running' && pomodoro.mode === 'focus') {
      setIsPlaying(true);
    }
  }, [pomodoro.status, pomodoro.mode, integrations.spotify]);

  // Simulate progress bar movement if playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1.5));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setTrackIndex(prev => (prev + 1) % activePlaylist.tracks.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setTrackIndex(prev => (prev - 1 + activePlaylist.tracks.length) % activePlaylist.tracks.length);
    setProgress(0);
  };

  const selectPlaylist = (playlist) => {
    setActivePlaylist(playlist);
    setTrackIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!integrations.spotify) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.25rem',
        backgroundColor: 'var(--bg-app)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(29, 185, 84, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1DB954'
        }}>
          <Music size={20} />
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Spotify Focus Music</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Connect Spotify to listen to curated focus tracks directly inside Conquer.
          </p>
        </div>
        <button
          onClick={() => toggleIntegration('spotify')}
          className="btn"
          style={{
            backgroundColor: '#1DB954',
            color: '#fff',
            fontSize: '0.8rem',
            padding: '6px 12px',
            width: '100%',
            fontWeight: '600'
          }}
        >
          Connect Account
        </button>
      </div>
    );
  }

  const currentTrack = activePlaylist.tracks[trackIndex];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      width: '100%',
      backgroundColor: 'var(--bg-app)',
      borderRadius: 'var(--radius-md)',
      padding: '0.75rem',
      border: '1px solid var(--border-color)'
    }}>
      {/* Connected Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#1DB954', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#1DB954', borderRadius: '50%' }} />
          SPOTIFY RUNNING
        </span>
        <button
          onClick={() => toggleIntegration('spotify')}
          style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}
        >
          Disconnect
        </button>
      </div>

      {/* Mini Player */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <img
          src={activePlaylist.art}
          alt={activePlaylist.name}
          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            color: 'var(--text-primary)'
          }}>
            {currentTrack}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {activePlaylist.name}
          </div>
        </div>
      </div>

      {/* Timeline slider */}
      <div style={{ width: '100%' }}>
        <div style={{
          width: '100%',
          height: '3px',
          backgroundColor: 'var(--border-color)',
          borderRadius: '2px',
          position: 'relative',
          cursor: 'pointer'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#1DB954',
            borderRadius: '2px'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>1:12</span>
          <span>3:30</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
        <button onClick={handlePrev} style={{ color: 'var(--text-secondary)' }} className="btn-ghost">
          <SkipBack size={14} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-app)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" style={{ marginLeft: '1px' }} />}
        </button>
        <button onClick={handleNext} style={{ color: 'var(--text-secondary)' }} className="btn-ghost">
          <SkipForward size={14} />
        </button>
      </div>

      {/* Curated focus playlist quick launcher */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', marginTop: '4px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>FOCUS PLAYLISTS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {FOCUS_PLAYLISTS.map(pl => (
            <button
              key={pl.id}
              onClick={() => selectPlaylist(pl)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 6px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                backgroundColor: activePlaylist.id === pl.id ? 'var(--border-color)' : 'transparent',
                textAlign: 'left',
                width: '100%',
                color: activePlaylist.id === pl.id ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              <Music size={12} style={{ color: activePlaylist.id === pl.id ? '#1DB954' : 'var(--text-muted)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
