import React, { useRef, useEffect } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  darkMode?: boolean;
}

export function CodeEditor({ value, onChange, darkMode = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      markdown(),
      keymap.of(defaultKeymap),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        '&': { height: '100%', fontSize: '14px' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { fontFamily: 'monospace' },
      }),
    ];

    if (darkMode) {
      extensions.push(oneDark);
    }

    const state = EditorState.create({ doc: value, extensions });
    const editorView = new EditorView({ state, parent: editorRef.current });
    viewRef.current = editorView;

    return () => editorView.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  return <div ref={editorRef} style={{ height: '100%', border: '1px solid #dfe1e6', borderRadius: '3px' }} />;
}
