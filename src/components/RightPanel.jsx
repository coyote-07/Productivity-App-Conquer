import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import PomodoroWidget from './PomodoroWidget';
import SpotifyWidget from './SpotifyWidget';
import { 
  Sparkles, Timer, Music, Info, 
  Send, Compass, ChevronRight, Play, Plus, CheckSquare 
} from 'lucide-react';

export default function RightPanel() {
  const {
    user,
    rightPanelCollapsed,
    setRightPanelCollapsed,
    activeSection,
    notes,
    selectedNoteId,
    tasks,
    addTask,
    domains,
    selectedDomainId,
    addNotification,
    showToast
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState('pomodoro'); // pomodoro, ai, spotify, info
  const [aiMessage, setAiMessage] = useState('');
  const [aiHistory, setAiHistory] = useState([
    { role: 'assistant', text: 'Hello! I am your Conquer AI. How can I help you master your day? Ask me to generate tasks, summarize notes, or suggest tags.' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  if (!user || rightPanelCollapsed) return null;

  // Context metadata variables
  const activeNote = notes.find(n => n.id === selectedNoteId);
  const activeDomain = domains.find(d => d.id === selectedDomainId);

  // Send message to mock AI
  const handleSendAi = (e) => {
    e.preventDefault();
    if (!aiMessage.trim() || aiLoading) return;

    const userText = aiMessage;
    setAiHistory(prev => [...prev, { role: 'user', text: userText }]);
    setAiMessage('');
    setAiLoading(true);

    // AI simulation delay
    setTimeout(() => {
      let reply = "I'm processing that. Let me look at your workspace.";
      let customAction = null;

      const lowerText = userText.toLowerCase();
      
      if (lowerText.includes('summarize') && activeNote) {
        reply = `Here is a summary of "**${activeNote.title}**":\n\nThis document outlines the core strategy and implementation details of your project. It includes actionable recommendations and lists step-by-step goals to execute next.`;
      } else if (lowerText.includes('task') || lowerText.includes('generate') || lowerText.includes('portfolio') || lowerText.includes('website')) {
        reply = `I have generated 5 tasks to help you **launch your website/portfolio**:\n\n1. Design the UI/UX mockups in Figma\n2. Scaffold project with React & Tailwind\n3. Write copy for projects & experience page\n4. Develop responsive layout & dark mode toggle\n5. Deploy to Vercel/Netlify\n\nWould you like me to add these tasks to your workspace?`;
        
        customAction = {
          label: 'Add 5 Generated Tasks',
          onClick: () => {
            const taskTitles = [
              'Design website UI/UX layout mockups',
              'Scaffold landing page project using React',
              'Draft copy for portfolio project descriptions',
              'Implement dark/light theme style sheets',
              'Deploy production build to hosting provider'
            ];
            taskTitles.forEach(t => addTask(t, null, activeDomain?.id, 'medium'));
            addNotification('AI Task Generation', 'Added 5 generated website launch tasks.');
            showToast('Tasks added successfully!');
          }
        };
      } else if (lowerText.includes('overdue') || lowerText.includes('tasks')) {
        const pendingTasks = tasks.filter(t => t.status !== 'done');
        reply = `You have **${pendingTasks.length} pending tasks** currently in your command center. I recommend tackling **"${pendingTasks[0]?.title || 'none'}"** first, as it aligns with your high-priority goals.`;
      } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
        reply = `Hello ${user.name}! What are we conquering today? I can help you summarize notes, suggest tags, or break down goals into milestones.`;
      } else {
        reply = `I analyzed your workspace: You have ${domains.length} active domains, ${tasks.filter(t => t.status === 'todo').length} pending tasks, and ${notes.length} notes. Let me know if you want me to write outline documents, create task lists, or organize your databases!`;
      }

      setAiHistory(prev => [...prev, { role: 'assistant', text: reply, action: customAction }]);
      setAiLoading(false);
    }, 1200);
  };

  return (
    <aside className="right-panel">
      {/* Top Navbar / Tab Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'pomodoro', icon: Timer, label: 'Timer' },
            { id: 'ai', icon: Sparkles, label: 'AI Chat' },
            { id: 'spotify', icon: Music, label: 'Spotify' },
            { id: 'info', icon: Info, label: 'Properties' }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? 'var(--accent-bg-subtle)' : 'transparent',
                  color: isSelected ? 'var(--accent-color)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={tab.label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => setRightPanelCollapsed(true)} 
          className="btn-ghost"
          style={{ padding: '4px', borderRadius: '4px' }}
          title="Collapse Panel"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* TAB 1: POMODORO TIMER */}
        {activeTab === 'pomodoro' && <PomodoroWidget />}

        {/* TAB 2: AI ASSISTANT CHAT */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-color)' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Conquer AI Copilot</span>
            </div>

            {/* Chat History */}
            <div style={{
              flex: 1,
              minHeight: '220px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              overflowY: 'auto',
              fontSize: '0.8rem'
            }}>
              {aiHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? 'var(--accent-color)' : 'var(--bg-surface)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    maxWidth: '85%',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                    whiteSpace: 'pre-line',
                    textAlign: 'left'
                  }}
                >
                  {msg.text}
                  {msg.action && (
                    <button
                      onClick={msg.action.onClick}
                      className="btn"
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--accent-color)',
                        color: '#fff',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={12} />
                      {msg.action.label}
                    </button>
                  )}
                </div>
              ))}
              {aiLoading && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  AI is analyzing...
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {[
                { text: 'Summarize page', prompt: 'Summarize the current note' },
                { text: 'Generate website tasks', prompt: 'Generate a task list to launch my website' },
                { text: 'Analyze workload', prompt: 'Show me my pending tasks overview' }
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAiMessage(sug.prompt);
                  }}
                  style={{
                    fontSize: '0.7rem',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '3px 8px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {sug.text}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAi} style={{ display: 'flex', gap: '4px', marginTop: 'auto' }}>
              <input
                type="text"
                placeholder="Ask AI..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '6px 8px', flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '32px', height: '32px', padding: '0', borderRadius: 'var(--radius-sm)' }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: SPOTIFY MUSIC */}
        {activeTab === 'spotify' && <SpotifyWidget />}

        {/* TAB 4: GENERAL CONTEXT INFO */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Page Properties
            </div>

            {activeSection === 'notes' && activeNote ? (
              <>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Title:</span>
                  <span style={{ fontWeight: '500', marginLeft: '6px', color: 'var(--text-primary)' }}>{activeNote.title}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Icon:</span>
                  <span style={{ marginLeft: '6px' }}>{activeNote.icon}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Read Time:</span>
                  <span style={{ marginLeft: '6px', color: 'var(--text-primary)' }}>{activeNote.readTime} min</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Word Count:</span>
                  <span style={{ marginLeft: '6px', color: 'var(--text-primary)' }}>{activeNote.wordCount} words</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Created:</span>
                  <span style={{ marginLeft: '6px', color: 'var(--text-primary)' }}>Today</span>
                </div>
                
                {/* Backlinks */}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Backlinks:</div>
                  {activeNote.backlinks && activeNote.backlinks.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {activeNote.backlinks.map((link, idx) => (
                        <div key={idx} style={{ color: 'var(--accent-notes)', textDecoration: 'underline', cursor: 'pointer' }}>
                          {link}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.75rem' }}>No backlinks found.</div>
                  )}
                </div>
              </>
            ) : activeSection === 'domains' && activeDomain ? (
              <>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Domain Name:</span>
                  <span style={{ fontWeight: '500', marginLeft: '6px', color: 'var(--text-primary)' }}>{activeDomain.name}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span style={{ 
                    marginLeft: '6px', 
                    color: activeDomain.status === 'active' ? 'var(--accent-goals)' : 'var(--text-muted)',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem'
                  }}>
                    {activeDomain.status}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Website:</span>
                  <span style={{ marginLeft: '6px', color: 'var(--accent-tasks)' }}>
                    {activeDomain.link || 'none'}
                  </span>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Open a page or domain to view properties.
              </div>
            )}

            {/* Quick Tips */}
            <div style={{
              marginTop: '1rem',
              backgroundColor: 'var(--bg-app)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              lineHeight: '1.4'
            }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>Keyboard Shortcuts</div>
              <div><code>Cmd + K</code>: Spotlight Search</div>
              <div><code>Cmd + J</code>: AI Popup Chat</div>
              <div><code>Esc</code>: Dismiss active Modal</div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
