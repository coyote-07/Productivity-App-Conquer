import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  FileText, Bold, Italic, Underline, 
  Trash2, Plus, Download, Sparkles, 
  Smile, Heading, List, CheckSquare, 
  Quote, Terminal, ChevronDown 
} from 'lucide-react';

const presetCovers = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
];

export default function Notes() {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    selectedNoteId,
    setSelectedNoteId,
    addXP,
    showToast
  } = useWorkspace();

  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef(null);

  const activeNote = notes.find(n => n.id === selectedNoteId);

  // Sync default selection if none open
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  // Command execution helper for editing
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    handleEditorChange();
  };

  const handleEditorChange = () => {
    if (!editorRef.current || !activeNote) return;
    const html = editorRef.current.innerHTML;
    
    // Calculate word count
    const text = editorRef.current.innerText || '';
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const readTime = Math.max(Math.ceil(words / 200), 1);

    updateNote(activeNote.id, {
      content: html,
      wordCount: words,
      readTime: readTime
    });
  };

  // Keyboard slash command listener
  const handleKeyDown = (e) => {
    if (e.key === '/') {
      // Open slash command helper menu
      setSlashMenuOpen(true);
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSlashPosition({
          top: rect.top + window.scrollY + 20,
          left: rect.left + window.scrollX
        });
      }
    } else if (e.key === 'Escape') {
      setSlashMenuOpen(false);
    }
  };

  const insertBlock = (type) => {
    setSlashMenuOpen(false);
    if (!editorRef.current) return;
    editorRef.current.focus();

    // Remove the trailing slash character if present
    if (editorRef.current.innerHTML.endsWith('/')) {
      editorRef.current.innerHTML = editorRef.current.innerHTML.slice(0, -1);
    }

    let blockHtml = '';
    if (type === 'h1') blockHtml = '<h1>Heading 1</h1><p>&nbsp;</p>';
    if (type === 'h2') blockHtml = '<h2>Heading 2</h2><p>&nbsp;</p>';
    if (type === 'todo') blockHtml = '<p><input type="checkbox" style="width: auto; margin-right: 8px;"> To do item</p><p>&nbsp;</p>';
    if (type === 'bullet') blockHtml = '<ul><li>List item</li></ul><p>&nbsp;</p>';
    if (type === 'callout') blockHtml = '<div class="callout-block" style="background-color: var(--bg-surface-hover); border-left: 4px solid var(--accent-notes); padding: 1rem; margin: 1rem 0;">💡 Callout block note</div><p>&nbsp;</p>';
    if (type === 'code') blockHtml = '<pre style="background: var(--code-bg); padding: 10px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85rem;"><code>// write code here</code></pre><p>&nbsp;</p>';

    document.execCommand('insertHTML', false, blockHtml);
    handleEditorChange();
  };

  // Export handlers
  const exportMarkdown = () => {
    if (!activeNote) return;
    
    // Quick HTML-to-MD cleaner
    let md = activeNote.content
      .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<p>(.*?)<\/p>/gi, '$1\n')
      .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/<br>/gi, '\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.toLowerCase().replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Downloaded as Markdown!");
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', height: '100%', minHeight: '500px', textAlign: 'left' }}>
      
      {/* LEFT COLUMN: PAGE NAVIGATION TREE */}
      <div style={{
        width: '200px',
        borderRight: '1px solid var(--border-color)',
        paddingRight: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>PAGES</span>
          <button 
            onClick={() => addNote('New Doc Page')}
            className="btn-ghost"
            style={{ padding: '2px', borderRadius: '4px' }}
            title="Create page"
          >
            <Plus size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
          {notes.map(n => (
            <div
              key={n.id}
              onClick={() => setSelectedNoteId(n.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedNoteId === n.id ? 'var(--accent-bg-subtle)' : 'transparent',
                color: selectedNoteId === n.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: selectedNoteId === n.id ? '600' : '400'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <span>{n.icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
              </div>

              {selectedNoteId === n.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete note?")) deleteNote(n.id);
                  }}
                  style={{ color: 'var(--accent-calendar)', padding: '2px' }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: NOTE WRITING CANVAS */}
      {activeNote ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          
          {/* Cover Banner */}
          <div style={{
            height: '140px',
            width: '100%',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundImage: `url(${activeNote.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => {
                const currentIdx = presetCovers.indexOf(activeNote.cover);
                const nextIdx = (currentIdx + 1) % presetCovers.length;
                updateNote(activeNote.id, { cover: presetCovers[nextIdx] });
              }}
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              Change Cover
            </button>
          </div>

          {/* Icon Picker Overlay & Title Input */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '-30px', padding: '0 1rem', alignItems: 'flex-end', zIndex: 1 }}>
            <button
              onClick={() => {
                const icons = ['📝', '📚', '🚀', '💡', '🧠', '💼', '🏡', '🎯'];
                const curIdx = icons.indexOf(activeNote.icon);
                const nextIdx = (curIdx + 1) % icons.length;
                updateNote(activeNote.id, { icon: icons[nextIdx] });
              }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface)',
                border: '3px solid var(--bg-app)',
                fontSize: '1.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Change emoji icon"
            >
              {activeNote.icon}
            </button>

            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.75rem',
                fontWeight: '800',
                padding: 0,
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                boxShadow: 'none'
              }}
            />
          </div>

          {/* Sticky Formatting Toolbar */}
          <div className="editor-toolbar" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button onClick={() => execCmd('bold')} title="Bold" style={{ padding: '6px', borderRadius: '4px' }} className="btn-ghost">
              <Bold size={16} />
            </button>
            <button onClick={() => execCmd('italic')} title="Italic" style={{ padding: '6px', borderRadius: '4px' }} className="btn-ghost">
              <Italic size={16} />
            </button>
            <button onClick={() => execCmd('underline')} title="Underline" style={{ padding: '6px', borderRadius: '4px' }} className="btn-ghost">
              <Underline size={16} />
            </button>
            
            <span style={{ borderLeft: '1px solid var(--border-color)', margin: '4px 6px' }} />

            <button onClick={() => insertBlock('h1')} style={{ padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }} className="btn-ghost">
              <Heading size={16} /> 1
            </button>
            <button onClick={() => insertBlock('h2')} style={{ padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }} className="btn-ghost">
              <Heading size={16} /> 2
            </button>

            <span style={{ borderLeft: '1px solid var(--border-color)', margin: '4px 6px' }} />

            <button onClick={() => insertBlock('todo')} title="Checklist" style={{ padding: '6px', borderRadius: '4px' }} className="btn-ghost">
              <CheckSquare size={16} />
            </button>
            <button onClick={() => insertBlock('bullet')} title="Bullet List" style={{ padding: '6px', borderRadius: '4px' }} className="btn-ghost">
              <List size={16} />
            </button>
            <button onClick={() => insertBlock('callout')} title="Callout box" style={{ padding: '6px', borderRadius: '4px' }} className="btn-ghost">
              <Quote size={16} />
            </button>
            <button onClick={() => insertBlock('code')} title="Code block" style={{ padding: '6px', borderRadius: '4px' }} className="btn-ghost">
              <Terminal size={16} />
            </button>

            <span style={{ borderLeft: '1px solid var(--border-color)', margin: '4px 6px' }} />

            {/* Export options */}
            <button onClick={exportMarkdown} title="Download Markdown" style={{ padding: '6px', borderRadius: '4px', color: 'var(--accent-color)', marginLeft: 'auto' }} className="btn-ghost">
              <Download size={16} />
            </button>
            <button onClick={exportPDF} title="Print / PDF" style={{ padding: '6px', borderRadius: '4px', color: 'var(--accent-color)' }} className="btn-ghost">
              PDF
            </button>
          </div>

          {/* HTML5 ContentEditable Editor Canvas */}
          <div style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            <div
              ref={editorRef}
              className="editor-textarea"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorChange}
              onKeyDown={handleKeyDown}
              dangerouslySetInnerHTML={{ __html: activeNote.content }}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                overflowY: 'auto',
                height: '100%',
                outline: 'none',
                textAlign: 'left'
              }}
            />
          </div>

          {/* Editor Status Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.5rem',
            marginTop: 'auto'
          }}>
            <div>
              Read Time: <strong>{activeNote.readTime} min</strong>
            </div>
            <div>
              Word Count: <strong>{activeNote.wordCount} words</strong>
            </div>
          </div>

          {/* Slash insertion menu */}
          {slashMenuOpen && (
            <div 
              style={{
                position: 'fixed',
                top: `${slashPosition.top}px`,
                left: `${slashPosition.left}px`,
                zIndex: 100,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-focus)',
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                width: '180px'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 'bold' }}>
                BASIC BLOCKS
              </div>
              <button 
                onClick={() => insertBlock('h1')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', fontSize: '0.8rem', borderRadius: '4px', width: '100%', textAlign: 'left' }}
                className="btn-ghost"
              >
                <Heading size={14} /> Heading 1
              </button>
              <button 
                onClick={() => insertBlock('h2')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', fontSize: '0.8rem', borderRadius: '4px', width: '100%', textAlign: 'left' }}
                className="btn-ghost"
              >
                <Heading size={14} /> Heading 2
              </button>
              <button 
                onClick={() => insertBlock('todo')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', fontSize: '0.8rem', borderRadius: '4px', width: '100%', textAlign: 'left' }}
                className="btn-ghost"
              >
                <CheckSquare size={14} /> To-do List
              </button>
              <button 
                onClick={() => insertBlock('bullet')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', fontSize: '0.8rem', borderRadius: '4px', width: '100%', textAlign: 'left' }}
                className="btn-ghost"
              >
                <List size={14} /> Bulleted List
              </button>
              <button 
                onClick={() => insertBlock('callout')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', fontSize: '0.8rem', borderRadius: '4px', width: '100%', textAlign: 'left' }}
                className="btn-ghost"
              >
                <Quote size={14} /> Callout Block
              </button>
              <button 
                onClick={() => insertBlock('code')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', fontSize: '0.8rem', borderRadius: '4px', width: '100%', textAlign: 'left' }}
                className="btn-ghost"
              >
                <Terminal size={14} /> Code Block
              </button>
            </div>
          )}

        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Create or select a note page to begin writing.
        </div>
      )}

    </div>
  );
}
