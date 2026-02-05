import React from 'react';
import { CodeEditor } from './CodeEditor';
import { MermaidRenderer } from './MermaidRenderer';

interface SplitPaneEditorProps {
  code: string;
  onChange: (code: string) => void;
  darkMode?: boolean;
}

export function SplitPaneEditor({ code, onChange, darkMode = false }: SplitPaneEditorProps) {
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 160px)', gap: '12px', padding: '0 16px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b778c', marginBottom: '4px' }}>
          Mermaid Syntax
        </div>
        <div style={{ flex: 1 }}>
          <CodeEditor value={code} onChange={onChange} darkMode={darkMode} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b778c', marginBottom: '4px' }}>
          Preview
        </div>
        <div style={{ flex: 1, border: '1px solid #dfe1e6', borderRadius: '3px', padding: '12px', overflow: 'auto', background: darkMode ? '#1b2638' : '#fff' }}>
          <MermaidRenderer code={code} theme={darkMode ? 'dark' : 'default'} />
        </div>
      </div>
    </div>
  );
}
