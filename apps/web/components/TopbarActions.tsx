'use client';

import { ThemeToggle } from './theme';

interface Props {
  onLogout: () => void;
  /** Quando presente, mostra o botão fechar_semana(). */
  onClose?: () => void;
  closeDisabled?: boolean;
}

/** Cluster fixo do topo: alternância de tema · sair · fechar_semana(). */
export function TopbarActions({ onLogout, onClose, closeDisabled }: Props) {
  return (
    <div className="b-topbar__act">
      <ThemeToggle />
      <button type="button" className="b-btn ghost" onClick={onLogout} title="Sair do sistema">
        sair
      </button>
      {onClose && (
        <button
          type="button"
          className="b-btn"
          onClick={onClose}
          disabled={closeDisabled}
          title={closeDisabled ? 'Marque ao menos uma tarefa para fechar a semana' : undefined}
        >
          fechar_semana()
        </button>
      )}
    </div>
  );
}
