import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Layout, Compass, Users, Sparkles, BookOpen, Heart, Cpu } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'temp_1',
    title: 'Sprint roadmap board',
    desc: 'Organize backlog pipelines, track task progress, and run agile sprints.',
    category: 'Project management',
    icon: Users,
    content: '<h2>Sprint Roadmap Board</h2><p>Use this doc to write release notes, sprint retro minutes, and outline task blocks.</p>',
    tasks: ['Draft Product Specification outline', 'Scaffold UI layout React files', 'Perform manual user validation checks']
  },
  {
    id: 'temp_2',
    title: 'Daily Reflection Journal',
    desc: 'Morning rutin guidelines, evening checks, and reflection prompts.',
    category: 'Personal productivity',
    icon: BookOpen,
    content: '<h2>Daily Reflection Journal</h2><h3>Morning Intentions:</h3><ul><li>What is my top priority today?</li><li>How do I want to show up?</li></ul><h3>Evening Reflections:</h3><ul><li>What went well?</li><li>What did I learn?</li></ul>',
    tasks: ['Write morning intention prompt', 'Complete evening review reflection']
  },
  {
    id: 'temp_3',
    title: 'Exam Study tracker',
    desc: 'Block calendars, group lecture topics, and track course assignments.',
    category: 'Student / academic',
    icon: Compass,
    content: '<h2>Exam Study Tracker</h2><p>Keep track of exam milestones, lecture notes references, and study hours loggers.</p>',
    tasks: ['Review lecture 4 slides notes', 'Draft exam prep checklist']
  },
  {
    id: 'temp_4',
    title: 'Technical design doc template',
    desc: 'Draft specifications, explain system patterns, and checklist code specs.',
    category: 'Engineering / dev',
    icon: Cpu,
    content: '<h2>Technical System Design Doc</h2><h3>1. Background & Context</h3><p>State problem statement.</p><h3>2. Architecture Overview</h3><p>Explain data schemas and pipeline diagrams.</p><h3>3. Execution Steps</h3>',
    tasks: ['Draft technical spec background outline', 'Draw system architecture data diagram']
  }
];

export default function Templates() {
  const {
    addNote,
    addTask,
    domains,
    showToast,
    addXP
  } = useWorkspace();

  const [activeFilter, setActiveFilter] = useState('All');

  const handleUseTemplate = (template) => {
    // 1. Create note from template HTML
    const noteId = addNote(template.title, template.content);
    
    // 2. Add sample tasks
    template.tasks.forEach(t => {
      addTask(t, null, domains[0]?.id || null, 'medium');
    });

    // 3. Reward XP & show Toast
    addXP(100);
    showToast(`Template "${template.title}" applied! +100 XP`);
  };

  const categories = ['All', 'Personal productivity', 'Project management', 'Student / academic', 'Engineering / dev'];
  const filteredTemplates = activeFilter === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', height: '100%', textAlign: 'left' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>🧩 Workflow Templates</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Instantly duplicate pre-built wiki documentation, schema tables, and tasks.
        </p>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              border: '1px solid var(--border-color)',
              backgroundColor: activeFilter === cat ? 'var(--accent-color)' : 'var(--bg-surface)',
              color: activeFilter === cat ? '#fff' : 'var(--text-secondary)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredTemplates.map(t => {
          const Icon = t.icon;
          return (
            <div 
              key={t.id} 
              className="card accented active-templates"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: 'var(--bg-surface)',
                padding: '1.25rem'
              }}
            >
              {/* Icon / Category */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-app)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-templates)'
                }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {t.category.split('/')[0]}
                </span>
              </div>

              {/* Title & Desc */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 4px', color: 'var(--text-primary)' }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  {t.desc}
                </p>
              </div>

              {/* Duplicate Button */}
              <button
                onClick={() => handleUseTemplate(t)}
                className="btn-primary"
                style={{
                  width: '100%',
                  fontSize: '0.8rem',
                  padding: '6px',
                  fontWeight: '600'
                }}
              >
                Use this Template
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
