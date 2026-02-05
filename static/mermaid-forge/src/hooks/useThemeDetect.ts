import { useState, useEffect } from 'react';

type Theme = 'default' | 'dark';

export function useThemeDetect(): Theme {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    const detectTheme = () => {
      const isDark =
        document.documentElement.getAttribute('data-color-mode') === 'dark' ||
        document.body.getAttribute('data-color-mode') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'default');
    };

    detectTheme();

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', detectTheme);

    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-color-mode'] });

    return () => {
      mq.removeEventListener('change', detectTheme);
      observer.disconnect();
    };
  }, []);

  return theme;
}
