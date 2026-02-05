import { useEffect, useRef, useCallback, useState } from 'react';
import mermaid from 'mermaid';

interface UseMermaidOptions {
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
}

export function useMermaid(options: UseMermaidOptions = {}) {
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: options.theme || 'default',
        maxTextSize: 50000,
      });
      initialized.current = true;
    }
  }, [options.theme]);

  const render = useCallback(async (code: string, container: HTMLElement) => {
    setError(null);
    if (!code.trim()) {
      container.textContent = '';
      return;
    }
    try {
      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(id, code);
      // Mermaid.render() with securityLevel:'strict' produces sanitized SVG.
      // This is the standard Mermaid.js API for rendering diagrams into the DOM.
      container.innerHTML = svg;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid Mermaid syntax';
      setError(msg);
      container.textContent = '';
    }
  }, []);

  return { render, error };
}
