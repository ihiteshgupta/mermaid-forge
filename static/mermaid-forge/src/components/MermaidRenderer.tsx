import React, { useRef, useEffect } from 'react';
import { useMermaid } from '../hooks/useMermaid';

interface MermaidRendererProps {
  code: string;
  theme?: 'default' | 'dark';
  onError?: (error: string | null) => void;
}

export function MermaidRenderer({ code, theme = 'default', onError }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { render, error } = useMermaid({ theme });

  useEffect(() => {
    if (containerRef.current) {
      render(code, containerRef.current);
    }
  }, [code, render]);

  useEffect(() => {
    onError?.(error);
  }, [error, onError]);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <div ref={containerRef} />
      {error && (
        <div style={{ color: '#de350b', padding: '8px 12px', fontSize: '13px', background: '#ffebe6', borderRadius: '3px', marginTop: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
