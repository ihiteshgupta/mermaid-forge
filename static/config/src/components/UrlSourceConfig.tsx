import React from 'react';

interface UrlSourceConfigProps {
  url: string;
  refreshInterval: string;
  onUrlChange: (url: string) => void;
  onRefreshChange: (interval: string) => void;
}

const REFRESH_OPTIONS = [
  { value: 'manual', label: 'Manual only' },
  { value: '1h', label: 'Every hour' },
  { value: '6h', label: 'Every 6 hours' },
  { value: '24h', label: 'Every 24 hours' },
  { value: '7d', label: 'Every 7 days' },
];

export function UrlSourceConfig({ url, refreshInterval, onUrlChange, onRefreshChange }: UrlSourceConfigProps) {
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b778c', marginBottom: '4px' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #dfe1e6', borderRadius: '3px', boxSizing: 'border-box' as const };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div>
        <label style={labelStyle}>Raw file URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://raw.githubusercontent.com/user/repo/main/diagram.mmd"
          style={inputStyle}
        />
        <div style={{ fontSize: '12px', color: '#6b778c', marginTop: '4px' }}>
          Paste the raw URL to a .mmd or text file containing Mermaid syntax
        </div>
      </div>
      <div>
        <label style={labelStyle}>Refresh interval</label>
        <select value={refreshInterval} onChange={(e) => onRefreshChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
          {REFRESH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
