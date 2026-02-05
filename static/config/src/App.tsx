import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';
import { SourceModeTabs } from './components/SourceModeTabs';
import { SplitPaneEditor } from './components/SplitPaneEditor';
import { UrlSourceConfig } from './components/UrlSourceConfig';
import { useThemeDetect } from './hooks/useThemeDetect';

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do something]
    B -->|No| D[Do something else]
    C --> E[End]
    D --> E`;

function App() {
  const [sourceMode, setSourceMode] = useState<'inline' | 'url'>('inline');
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_DIAGRAM);
  const [externalUrl, setExternalUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('manual');
  const [loading, setLoading] = useState(true);
  const theme = useThemeDetect();
  const isDark = theme === 'dark';

  useEffect(() => {
    view.getContext().then((context) => {
      const config = context.extension?.config;
      if (config) {
        setSourceMode(config.sourceMode || 'inline');
        setMermaidCode(config.mermaidCode || DEFAULT_DIAGRAM);
        setExternalUrl(config.externalUrl || '');
        setRefreshInterval(config.refreshInterval || 'manual');
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    await view.submit({
      config: {
        sourceMode,
        mermaidCode,
        externalUrl,
        refreshInterval,
      },
    });
  };

  const handleCancel = () => {
    view.close();
  };

  if (loading) {
    return <div style={{ padding: '16px', color: '#6b778c' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <SourceModeTabs mode={sourceMode} onChange={setSourceMode} />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {sourceMode === 'inline' ? (
          <SplitPaneEditor code={mermaidCode} onChange={setMermaidCode} darkMode={isDark} />
        ) : (
          <UrlSourceConfig
            url={externalUrl}
            refreshInterval={refreshInterval}
            onUrlChange={setExternalUrl}
            onRefreshChange={setRefreshInterval}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderTop: '1px solid #dfe1e6' }}>
        <button onClick={handleCancel} style={{ padding: '8px 16px', fontSize: '14px', border: '1px solid #dfe1e6', borderRadius: '3px', background: '#fff', cursor: 'pointer' }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{ padding: '8px 16px', fontSize: '14px', border: 'none', borderRadius: '3px', background: '#0052cc', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
          Save
        </button>
      </div>
    </div>
  );
}

export default App;
