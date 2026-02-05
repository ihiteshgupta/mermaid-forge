import React from 'react';

interface SourceModeTabsProps {
  mode: 'inline' | 'url';
  onChange: (mode: 'inline' | 'url') => void;
}

export function SourceModeTabs({ mode, onChange }: SourceModeTabsProps) {
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    cursor: 'pointer',
    color: active ? '#0052cc' : '#6b778c',
    fontWeight: active ? 600 : 400,
    fontSize: '14px',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid #0052cc' : '2px solid transparent',
  });

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #dfe1e6', marginBottom: '12px' }}>
      <button style={tabStyle(mode === 'inline')} onClick={() => onChange('inline')}>
        Inline Editor
      </button>
      <button style={tabStyle(mode === 'url')} onClick={() => onChange('url')}>
        External URL
      </button>
    </div>
  );
}
