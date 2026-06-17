'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'cairn.theme';

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Lê/escreve o tema em [data-theme] no <html> e persiste no localStorage. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark');

  // Sincroniza com o que o script anti-flash já aplicou ao <html>.
  useEffect(() => setTheme(currentTheme()), []);

  function toggle() {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // sem localStorage (modo privado) — segue só na sessão
    }
    setTheme(next);
  }

  return [theme, toggle];
}

/** Botão de alternância claro/escuro. */
export function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const toLight = theme === 'dark';
  return (
    <button
      type="button"
      className="b-btn ghost icon"
      onClick={toggle}
      aria-label={toLight ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={toLight ? 'Tema claro' : 'Tema escuro'}
    >
      {toLight ? '☀' : '☾'}
    </button>
  );
}
