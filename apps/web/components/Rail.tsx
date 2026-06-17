'use client';

import { MOCK_TRACKS, type Screen } from '@/lib/coach';

interface Props {
  screen: Screen;
  onScreen: (s: Screen) => void;
  weekNumber: number;
}

/** Sidebar do painel: navegação + trilhas (mock até a Fatia 3). */
export function Rail({ screen, onScreen, weekNumber }: Props) {
  const projetos = MOCK_TRACKS.filter((t) => t.type === 'projeto');
  const cadencias = MOCK_TRACKS.filter((t) => t.type === 'cadencia');

  return (
    <aside className="b-rail">
      <div className="b-rail__brand">
        <span className="sq">C</span> Coach
        <span className="ver">s{weekNumber}</span>
      </div>

      <nav className="b-nav">
        <button aria-current={screen === 'week'} onClick={() => onScreen('week')}>
          <span className="gl">▣</span> Semana atual
        </button>
        <button aria-current={screen === 'tracks'} onClick={() => onScreen('tracks')}>
          <span className="gl">⋔</span> Trilhas
        </button>
      </nav>

      <div className="b-rail__sec">projetos</div>
      {projetos.map((t) => {
        const pct = Math.round((t.progress ?? 0) * 100);
        return (
          <div className="b-railtrack" key={t.id}>
            <div className="rt-top">
              <span className="rt-code">{t.code}</span>
              <span className="rt-name">{t.short}</span>
              <span className="rt-name" style={{ marginLeft: 'auto', flex: '0 0 auto' }}>
                {pct}%
              </span>
            </div>
            <div className="rt-bar">
              <i style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}

      <div className="b-rail__sec">cadências</div>
      {cadencias.map((t) => {
        const streak = t.streak ?? 0;
        return (
          <div className="b-railtrack cad" key={t.id}>
            <div className="rt-top">
              <span className="rt-code">{t.code}</span>
              <span className="rt-name">{t.short}</span>
            </div>
            <div className="rt-cells">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={streak >= 5 || i < streak % 5 ? 'on' : ''} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="b-rail__foot">
        <span className="av">E</span>
        <span className="who">edu@coach</span>
        <span className="badge">mock</span>
      </div>
    </aside>
  );
}
