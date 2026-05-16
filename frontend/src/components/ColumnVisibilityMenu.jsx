import React from 'react';

const panelStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center',
  padding: '12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  background: '#fff',
  marginBottom: '12px'
};

const ColumnVisibilityMenu = ({ columns, visibleColumns, setVisibleColumns }) => {
  const toggleColumn = (key) => {
    setVisibleColumns(prev => (
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    ));
  };

  const allKeys = columns.map(column => column.key);
  const allSelected = allKeys.every(key => visibleColumns.includes(key));

  return (
    <div style={panelStyle}>
      <strong style={{ fontSize: '13px', color: '#334155', marginRight: '4px' }}>Fields</strong>
      <button
        type="button"
        onClick={() => setVisibleColumns(allSelected ? [] : allKeys)}
        style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', cursor: 'pointer' }}
      >
        {allSelected ? 'Uncheck All' : 'Check All'}
      </button>
      {columns.map(column => (
        <label key={column.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155' }}>
          <input
            type="checkbox"
            checked={visibleColumns.includes(column.key)}
            onChange={() => toggleColumn(column.key)}
          />
          {column.label}
        </label>
      ))}
    </div>
  );
};

export default ColumnVisibilityMenu;
