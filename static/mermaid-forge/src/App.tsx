import React, { useEffect, useState } from 'react';
import { view, invoke } from '@forge/bridge';
import { MermaidRenderer } from './components/MermaidRenderer';
import { useThemeDetect } from './hooks/useThemeDetect';

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do something]
    B -->|No| D[Do something else]
    C --> E[End]
    D --> E`;

interface MacroConfig {
  sourceMode?: 'inline' | 'url';
  mermaidCode?: string;
  externalUrl?: string;
  refreshInterval?: string;
}

interface FetchResult {
  content?: string;
  error?: string;
  warning?: string;
  fromCache?: boolean;
  fetchedAt?: number;
}

function App() {
  const [code, setCode] = useState('');
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useThemeDetect();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const context = await view.getContext();
        const config = (context.extension?.config || {}) as MacroConfig;

        if (!config.sourceMode || config.sourceMode === 'inline') {
          setCode(config.mermaidCode || DEFAULT_DIAGRAM);
        } else if (config.sourceMode === 'url' && config.externalUrl) {
          const result: FetchResult = await invoke('fetchExternalUrl', {
            url: config.externalUrl,
            refreshInterval: config.refreshInterval || 'manual',
            macroId: context.localId,
          });
          if (result.error) {
            setWarning(result.error);
            setCode('');
          } else {
            setCode(result.content || '');
            if (result.warning) setWarning(result.warning);
          }
        } else {
          setCode(DEFAULT_DIAGRAM);
        }
      } catch (err) {
        setCode(DEFAULT_DIAGRAM);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return <div style={{ padding: '16px', color: '#6b778c' }}>Loading diagram...</div>;
  }

  return (
    <div style={{ padding: '8px 0' }}>
      {warning && (
        <div style={{ padding: '8px 12px', marginBottom: '8px', background: '#fffae6', color: '#172b4d', borderRadius: '3px', fontSize: '13px', border: '1px solid #ffe380' }}>
          {warning}
        </div>
      )}
      <MermaidRenderer code={code} theme={theme} />
    </div>
  );
}

export default App;
