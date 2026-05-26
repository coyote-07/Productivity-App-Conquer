import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, CheckCircle } from 'lucide-react';

export default function PomodoroWidget() {
  const {
    tasks,
    updateTask,
    pomodoro,
    setPomodoro,
    addXP,
    showToast
  } = useWorkspace();

  const [timeLeft, setTimeLeft] = useState(pomodoro.duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const noiseNodeRef = useRef(null);

  // Re-sync duration when pomodoro context state shifts modes
  useEffect(() => {
    setTimeLeft(pomodoro.duration);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [pomodoro.duration, pomodoro.mode]);

  // Audio synthesis helper for tick/rain sounds
  const playSoundEffect = (type) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'chime') {
        // High frequency bell tone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.6);
        osc2.stop(ctx.currentTime + 1.6);
      }
    } catch (e) {
      console.warn("Audio synthesis error: ", e);
    }
  };

  // Noise generator for rain sound
  const startRainSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Create white noise buffer
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter white noise to sound like rain (lowpass filter around 800Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.value = 0.08; // quiet background

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      noiseNodeRef.current = { source: whiteNoise, gain: gain };
    } catch (e) {
      console.warn("Rain noise setup error: ", e);
    }
  };

  const stopRainSound = () => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.source.stop();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      // Handle background sounds
      if (pomodoro.sound === 'rain') {
        startRainSound();
      }
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            stopRainSound();
            handleTimerComplete();
            return 0;
          }

          // Optional tick sound
          if (pomodoro.sound === 'ticking') {
            playSoundEffect('tick');
          }
          
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      stopRainSound();
    }

    return () => {
      clearInterval(timerRef.current);
      stopRainSound();
    };
  }, [isPlaying, pomodoro.sound]);

  const handleTimerComplete = () => {
    playSoundEffect('chime');
    
    // Reward XP based on mode
    if (pomodoro.mode === 'focus') {
      const xpReward = 30;
      addXP(xpReward);
      showToast(`Pomodoro complete! +${xpReward} XP`);
      
      // Increment session metrics
      setPomodoro(prev => ({
        ...prev,
        sessionsCount: prev.sessionsCount + 1,
        elapsed: prev.elapsed + 25
      }));

      // Log time against selected task
      if (pomodoro.activeTaskId) {
        const task = tasks.find(t => t.id === pomodoro.activeTaskId);
        if (task) {
          const newTimeLog = {
            id: 'log_' + Date.now(),
            duration: 25,
            taskName: task.title,
            timestamp: new Date().toISOString()
          };
          const logs = [...(task.timeLogs || []), newTimeLog];
          updateTask(task.id, {
            timeLogs: logs,
            pomodorosCount: (task.pomodorosCount || 0) + 1
          });
        }
      }

      // Propose short break
      setPomodoro(prev => ({
        ...prev,
        mode: 'short-break',
        duration: 300 // 5 min
      }));
    } else {
      showToast("Break complete! Ready to conquer?");
      setPomodoro(prev => ({
        ...prev,
        mode: 'focus',
        duration: 1500 // 25 min
      }));
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(pomodoro.mode === 'focus' ? 1500 : pomodoro.mode === 'short-break' ? 300 : 900);
  };

  const handleSkip = () => {
    setIsPlaying(false);
    if (pomodoro.mode === 'focus') {
      setPomodoro(prev => ({ ...prev, mode: 'short-break', duration: 300 }));
    } else {
      setPomodoro(prev => ({ ...prev, mode: 'focus', duration: 1500 }));
    }
  };

  const setSoundMode = (sound) => {
    setPomodoro(prev => ({ ...prev, sound }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circular progress calculations
  const totalDuration = pomodoro.mode === 'focus' ? 1500 : pomodoro.mode === 'short-break' ? 300 : 900;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 280 - (280 * progressPercent) / 100;

  // Find linked task
  const activeTask = tasks.find(t => t.id === pomodoro.activeTaskId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1rem' }}>
      
      {/* Mode selection pills */}
      <div style={{
        display: 'flex',
        background: 'var(--border-color)',
        borderRadius: '20px',
        padding: '2px',
        width: '100%'
      }}>
        {['focus', 'short-break', 'long-break'].map(m => (
          <button
            key={m}
            onClick={() => setPomodoro(prev => ({
              ...prev,
              mode: m,
              duration: m === 'focus' ? 1500 : m === 'short-break' ? 300 : 900
            }))}
            style={{
              flex: 1,
              padding: '6px 2px',
              fontSize: '0.75rem',
              borderRadius: '18px',
              fontWeight: pomodoro.mode === m ? '600' : '400',
              backgroundColor: pomodoro.mode === m ? 'var(--accent-color)' : 'transparent',
              color: pomodoro.mode === m ? '#fff' : 'var(--text-secondary)',
              textTransform: 'capitalize'
            }}
          >
            {m.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Task Picker */}
      <div style={{ width: '100%', textAlign: 'left' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
          FOCUSING ON TASK
        </label>
        <select
          value={pomodoro.activeTaskId || ''}
          onChange={(e) => setPomodoro(prev => ({ ...prev, activeTaskId: e.target.value || null }))}
          style={{ width: '100%', fontSize: '0.8rem', padding: '6px' }}
        >
          <option value="">-- Generic Session (No Task) --</option>
          {tasks.filter(t => t.status !== 'done').map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        {activeTask && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '4px',
            fontSize: '0.75rem',
            color: 'var(--accent-color)'
          }}>
            <CheckCircle size={12} />
            <span>XP will be logged to this task ({activeTask.pomodorosCount || 0} completed)</span>
          </div>
        )}
      </div>

      {/* Circular Countdown Ring */}
      <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0.5rem 0' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="transparent"
            stroke="var(--border-color)"
            strokeWidth="3"
          />
          {/* Animated progress circle */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="transparent"
            stroke="var(--accent-color)"
            strokeWidth="4"
            strokeDasharray="276"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {formatTime(timeLeft)}
          </span>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            {pomodoro.mode === 'focus' ? 'Conquer' : 'Recharge'}
          </span>
        </div>
      </div>

      {/* Play/Pause controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={handleReset}
          className="btn-secondary"
          style={{ width: '32px', height: '32px', borderRadius: '50%', padding: '0' }}
          title="Reset timer"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={handlePlayPause}
          className="btn-primary"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            padding: '0',
            backgroundColor: 'var(--accent-color)',
            color: '#fff'
          }}
          title={isPlaying ? 'Pause' : 'Start Focus'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
        </button>

        <button
          onClick={handleSkip}
          className="btn-secondary"
          style={{ width: '32px', height: '32px', borderRadius: '50%', padding: '0' }}
          title="Skip session"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Sounds controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'var(--bg-app)',
        padding: '3px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        width: '100%',
        justifyContent: 'space-around',
        fontSize: '0.75rem'
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', paddingLeft: '4px' }}>AMBIENT:</span>
        {['silent', 'ticking', 'rain'].map(s => (
          <button
            key={s}
            onClick={() => setSoundMode(s)}
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'capitalize',
              backgroundColor: pomodoro.sound === s ? 'var(--border-focus)' : 'transparent',
              color: pomodoro.sound === s ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Daily Stats */}
      <div style={{
        width: '100%',
        backgroundColor: 'var(--bg-app)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem',
        border: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        textAlign: 'left',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '2px', color: 'var(--text-primary)' }}>Focus Stats</div>
        <div>Completed Today: {pomodoro.sessionsCount} sessions</div>
        <div style={{ color: 'var(--text-muted)' }}>Total Focus Time: {pomodoro.elapsed} mins</div>
      </div>
    </div>
  );
}
