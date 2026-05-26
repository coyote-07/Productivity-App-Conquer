import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Sparkles, Search, Compass, Plus, 
  CheckCircle, Zap, Shield, FileText 
} from 'lucide-react';

export default function AiAssistantPage() {
  const {
    addTask,
    domains,
    addNotification,
    showToast,
    addXP
  } = useWorkspace();

  // Generator states
  const [goalDesc, setGoalDesc] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPreview, setSearchPreview] = useState([]);

  // Auto organizer states
  const [pasteContent, setPasteContent] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isOrganizing, setIsOrganizing] = useState(false);

  const handleGenerateTasks = (e) => {
    e.preventDefault();
    if (!goalDesc.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedTasks([]);

    // Simulate smart decomposition based on keywords
    setTimeout(() => {
      let items = [
        { title: 'Define scope, deadlines, and project milestones', priority: 'high', checked: true },
        { title: 'Create wireframes and mock UI layouts', priority: 'medium', checked: true },
        { title: 'Scaffold project code repo structure', priority: 'medium', checked: true },
        { title: 'Develop responsive mobile-first component views', priority: 'high', checked: true },
        { title: 'Test user interaction flows and fix bugs', priority: 'low', checked: true }
      ];

      const lower = goalDesc.toLowerCase();
      if (lower.includes('website') || lower.includes('portfolio') || lower.includes('app')) {
        items = [
          { title: 'Design Figma layout wireframes', priority: 'high', checked: true },
          { title: 'Setup React skeleton boilerplate codebase', priority: 'high', checked: true },
          { title: 'Implement dark mode color styles sheets', priority: 'medium', checked: true },
          { title: 'Write portfolio experience copy content docs', priority: 'medium', checked: true },
          { title: 'Deploy static build assets to hosting provider', priority: 'low', checked: true }
        ];
      } else if (lower.includes('fitness') || lower.includes('health') || lower.includes('run')) {
        items = [
          { title: 'Purchase running shoes and workout gym gear', priority: 'medium', checked: true },
          { title: 'Define X3 times per week exercise schedule', priority: 'high', checked: true },
          { title: 'Setup hydration check-in habit streak tracker', priority: 'high', checked: true },
          { title: 'Log baseline workout stats measurements', priority: 'low', checked: true }
        ];
      }

      setGeneratedTasks(items);
      setIsGenerating(false);
      addXP(10);
    }, 1200);
  };

  const handleAcceptTasks = () => {
    const selected = generatedTasks.filter(t => t.checked);
    if (selected.length === 0) return;

    selected.forEach(t => {
      addTask(t.title, null, domains[0]?.id || null, t.priority);
    });

    addNotification('AI Generator', `Added ${selected.length} tasks generated for "${goalDesc}".`);
    showToast(`Added ${selected.length} tasks!`);
    setGeneratedTasks([]);
    setGoalDesc('');
  };

  const handleSuggestOrganization = (e) => {
    e.preventDefault();
    if (!pasteContent.trim() || isOrganizing) return;

    setIsOrganizing(true);
    setTimeout(() => {
      setSuggestedTags(['#learning', '#react', '#docs']);
      setIsOrganizing(false);
      showToast("Suggestions generated!");
    }, 800);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', width: '100%', height: '100%', textAlign: 'left', paddingBottom: '3rem' }}>
      
      {/* LEFT COLUMN: AI TOOLS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Page Header */}
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            marginBottom: '4px',
            background: 'var(--accent-ai-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🤖 AI Command Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Automate task generation, run smart searches, and organize pages.
          </p>
        </div>

        {/* TOOL 1: TASK GENERATOR */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-color)' }}>
            <Zap size={16} />
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>AI Smart Task Decomposition</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Describe a goal (e.g. "Launch a mobile app") and let AI generate a checklist of actionable subtasks.
          </p>

          <form onSubmit={handleGenerateTasks} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="e.g. Host a tech community webinar..."
              value={goalDesc}
              onChange={(e) => setGoalDesc(e.target.value)}
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Break Down'}
            </button>
          </form>

          {/* Generated checklists preview */}
          {generatedTasks.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: 'var(--bg-app)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                SUGGESTED CHECKLIST ITEMS
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {generatedTasks.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <input
                      type="checkbox"
                      checked={t.checked}
                      onChange={() => {
                        const copy = [...generatedTasks];
                        copy[idx].checked = !copy[idx].checked;
                        setGeneratedTasks(copy);
                      }}
                      style={{ width: 'auto' }}
                    />
                    <span style={{ color: 'var(--text-primary)', flex: 1 }}>{t.title}</span>
                    <span className={`priority-dot priority-${t.priority}`} title={t.priority} />
                  </div>
                ))}
              </div>

              <button
                onClick={handleAcceptTasks}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginTop: '0.5rem'
                }}
              >
                Accept and Deploy Selected Tasks
              </button>
            </div>
          )}
        </div>

        {/* TOOL 2: CONTENT AUTO-ORGANIZER */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-color)' }}>
            <Shield size={16} />
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>Smart Page Auto-Organizer</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Paste raw text notes or idea lists. The AI will recommend organization tags and life domains.
          </p>

          <form onSubmit={handleSuggestOrganization} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              placeholder="Paste raw thoughts, notes, links..."
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              rows="3"
              style={{ fontSize: '0.8rem' }}
            />
            <button
              type="submit"
              className="btn-secondary"
              style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '0.8rem' }}
              disabled={isOrganizing}
            >
              {isOrganizing ? 'Organizing...' : 'Let AI Organize Page'}
            </button>
          </form>

          {suggestedTags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>SUGGESTED TAGS:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {suggestedTags.map(t => (
                  <span 
                    key={t}
                    style={{
                      backgroundColor: 'var(--accent-bg-subtle)',
                      color: 'var(--accent-color)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: AI CONCEPTS GUIDES */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>AI ASSISTANCE FAQ</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>What is Auto-Tagging?</div>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            When writing a document, AI analyzes keywords to recommend tags.
          </p>

          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.5rem' }}>Slash Command AI</div>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Select any written text or block in our editor to highlight, translate, or outline code modules.
          </p>
        </div>
      </div>

    </div>
  );
}
