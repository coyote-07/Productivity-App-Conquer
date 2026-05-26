import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Database, Plus, Trash2, LayoutGrid, 
  Table as TableIcon, Filter, ArrowUpDown, ChevronDown 
} from 'lucide-react';

export default function Databases() {
  const {
    databases,
    addDatabase,
    updateDatabase,
    deleteDatabase,
    addXP,
    showToast
  } = useWorkspace();

  const [selectedDbId, setSelectedDbId] = useState(null);
  const [newDbName, setNewDbName] = useState('');
  
  // Database edit states
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState('text');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const activeDb = databases.find(db => db.id === selectedDbId);

  const handleCreateDb = (e) => {
    e.preventDefault();
    if (!newDbName.trim()) return;

    addDatabase(newDbName);
    setNewDbName('');
    showToast("Database created!");
  };

  const handleAddColumn = (e) => {
    e.preventDefault();
    if (!newColName.trim() || !activeDb) return;

    // Check duplicate
    if (activeDb.columns.some(c => c.name === newColName)) {
      alert("Column already exists.");
      return;
    }

    const cols = [...activeDb.columns, { name: newColName, type: newColType }];
    
    // Add default cell value to existing rows
    const rows = activeDb.rows.map(r => ({
      ...r,
      [newColName]: newColType === 'select' ? 'not started' : ''
    }));

    updateDatabase(activeDb.id, { columns: cols, rows: rows });
    setNewColName('');
    addXP(10);
  };

  const handleAddRow = () => {
    if (!activeDb) return;
    
    // Construct default row object
    const newRow = { id: 'row_' + Date.now() };
    activeDb.columns.forEach(c => {
      newRow[c.name] = c.type === 'select' ? 'not started' : '';
    });

    updateDatabase(activeDb.id, {
      rows: [...activeDb.rows, newRow]
    });
    addXP(5);
  };

  const handleCellEdit = (rowId, columnName, value) => {
    if (!activeDb) return;
    const rows = activeDb.rows.map(r => 
      r.id === rowId ? { ...r, [columnName]: value } : r
    );
    updateDatabase(activeDb.id, { rows });
  };

  const handleDeleteRow = (rowId) => {
    if (!activeDb) return;
    const rows = activeDb.rows.filter(r => r.id !== rowId);
    updateDatabase(activeDb.id, { rows });
  };

  // Filter & Sort Logic
  const getFilteredRows = () => {
    if (!activeDb) return [];
    let list = [...activeDb.rows];

    // Filter
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(row => 
        Object.values(row).some(val => 
          val && val.toString().toLowerCase().includes(q)
        )
      );
    }

    // Sort
    if (sortField) {
      list.sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return list;
  };

  // If database is open, render spreadsheet UI
  if (activeDb) {
    const tableRows = getFilteredRows();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.25rem', textAlign: 'left', paddingBottom: '3rem' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setSelectedDbId(null)}
            style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
          >
            Databases
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{activeDb.name}</span>
          
          <button
            onClick={() => {
              if(confirm("Delete entire database?")) {
                deleteDatabase(activeDb.id);
                setSelectedDbId(null);
              }
            }}
            style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--accent-calendar)' }}
          >
            Delete Database
          </button>
        </div>

        {/* Database Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '4px' }}>🗄️ {activeDb.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Schema Table with customizable fields. Double click fields to edit inline.
            </p>
          </div>

          {/* Layout switches */}
          <div style={{ display: 'flex', backgroundColor: 'var(--border-color)', padding: '2px', borderRadius: '6px' }}>
            <button
              onClick={() => updateDatabase(activeDb.id, { view: 'table' })}
              style={{
                padding: '4px 6px',
                borderRadius: '4px',
                backgroundColor: activeDb.view === 'table' ? 'var(--bg-surface)' : 'transparent',
                color: activeDb.view === 'table' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
              title="Table view"
            >
              <TableIcon size={14} />
            </button>
            <button
              onClick={() => updateDatabase(activeDb.id, { view: 'gallery' })}
              style={{
                padding: '4px 6px',
                borderRadius: '4px',
                backgroundColor: activeDb.view === 'gallery' ? 'var(--bg-surface)' : 'transparent',
                color: activeDb.view === 'gallery' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
              title="Gallery view"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        {/* Filters and sorting toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '10px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)'
        }}>
          {/* Search filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Filter size={14} />
            <input
              type="text"
              placeholder="Search table values..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{ padding: '3px 8px', fontSize: '0.75rem', width: '160px' }}
            />
          </div>

          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ArrowUpDown size={14} />
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setSortAsc(true);
              }}
              style={{ padding: '3px 8px', fontSize: '0.75rem', width: '130px' }}
            >
              <option value="">-- Sort field --</option>
              {activeDb.columns.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            {sortField && (
              <button
                onClick={() => setSortAsc(!sortAsc)}
                style={{ fontSize: '0.75rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px' }}
              >
                {sortAsc ? 'Asc' : 'Desc'}
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: SPREADSHEET TABLE GRID */}
        {activeDb.view === 'table' ? (
          <div className="db-table-container">
            <table className="db-table">
              <thead>
                <tr>
                  {activeDb.columns.map(col => (
                    <th key={col.name}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{col.name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                          ({col.type})
                        </span>
                      </div>
                    </th>
                  ))}
                  <th style={{ width: '40px' }} />
                </tr>
              </thead>
              <tbody>
                {tableRows.map(row => (
                  <tr key={row.id}>
                    {activeDb.columns.map(col => (
                      <td key={col.name}>
                        {col.type === 'select' ? (
                          <select
                            value={row[col.name] || 'not started'}
                            onChange={(e) => handleCellEdit(row.id, col.name, e.target.value)}
                            style={{ padding: '2px 4px', fontSize: '0.8rem', border: 'none', background: 'transparent' }}
                          >
                            <option value="not started">Not Started</option>
                            <option value="in progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        ) : col.type === 'date' ? (
                          <input
                            type="date"
                            value={row[col.name] || ''}
                            onChange={(e) => handleCellEdit(row.id, col.name, e.target.value)}
                            style={{ padding: '2px', fontSize: '0.8rem', border: 'none', background: 'transparent' }}
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[col.name] || ''}
                            onChange={(e) => handleCellEdit(row.id, col.name, e.target.value)}
                            style={{ padding: '2px', fontSize: '0.8rem', border: 'none', background: 'transparent' }}
                          />
                        )}
                      </td>
                    ))}
                    <td>
                      <button 
                        onClick={() => handleDeleteRow(row.id)}
                        style={{ color: 'var(--text-muted)', padding: '2px' }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* VIEW 2: GALLERY GRID */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {tableRows.map(row => (
              <div 
                key={row.id} 
                className="card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                {/* Title */}
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                  {row[activeDb.columns[0]?.name] || 'Untitled Row'}
                </div>

                {/* Subfields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                  {activeDb.columns.slice(1).map(col => (
                    <div key={col.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{col.name}:</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{row[col.name] || '—'}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleDeleteRow(row.id)}
                  style={{ color: 'var(--accent-calendar)', fontSize: '0.75rem', marginTop: '4px', textAlign: 'right', display: 'block' }}
                >
                  Delete Entry
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            onClick={handleAddRow}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            + Add New Entry Row
          </button>

          {/* Add columns subform */}
          <form onSubmit={handleAddColumn} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-surface)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ADD FIELD:</span>
            <input
              type="text"
              placeholder="Column name..."
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              style={{ fontSize: '0.75rem', padding: '2px 6px', width: '110px' }}
            />
            <select
              value={newColType}
              onChange={(e) => setNewColType(e.target.value)}
              style={{ fontSize: '0.75rem', padding: '2px', width: '90px' }}
            >
              <option value="text">Text</option>
              <option value="date">Date</option>
              <option value="select">Select status</option>
            </select>
            <button type="submit" className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
              Add
            </button>
          </form>
        </div>

      </div>
    );
  }

  // Otherwise, list active databases
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.5rem', textAlign: 'left' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>🗄️ Workspaces Databases</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Create schema sheets to store structures, formulas, and references.
        </p>
      </div>

      {/* Creation form */}
      <form onSubmit={handleCreateDb} style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="New database title..."
          value={newDbName}
          onChange={(e) => setNewDbName(e.target.value)}
        />
        <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          Create Table
        </button>
      </form>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {databases.map(db => (
          <div
            key={db.id}
            onClick={() => setSelectedDbId(db.id)}
            className="card accented active-databases"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-databases)'
            }}>
              <Database size={20} />
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {db.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {db.rows.length} rows · {db.columns.length} columns ({db.view})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
