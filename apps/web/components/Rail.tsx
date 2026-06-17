'use client';

import type { Track, UserProfile } from '@cairn/types';
import type { Screen } from '@/lib/coach';

interface Props {
  screen: Screen;
  onScreen: (s: Screen) => void;
  weekNumber: number;
  tracks: Track[];
  profile: UserProfile | null;
}

/** Sidebar do painel: navegação + trilhas reais (Fatia 3a). */
export function Rail({ screen, onScreen, weekNumber, tracks, profile }: Props) {
  const projetos = tracks.filter((t) => t.type === 'project');
  const cadencias = tracks.filter((t) => t.type === 'cadence');
  const who = profile?.name ?? profile?.email ?? '—';
  const avatar = (profile?.name ?? profile?.email ?? 'U').charAt(0).toUpperCase();

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
        <button aria-current={screen === 'settings'} onClick={() => onScreen('settings')}>
          <span className="gl">⚙</span> Ajustes
        </button>
      </nav>

      <div className="b-rail__sec">projetos</div>
      {projetos.map((t) => {
        const pct = t.progress ?? 0;
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
        const streak = Math.min(t.streak ?? 0, 5);
        return (
          <div className="b-railtrack cad" key={t.id}>
            <div className="rt-top">
              <span className="rt-code">{t.code}</span>
              <span className="rt-name">{t.short}</span>
            </div>
            <div className="rt-cells">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={i < streak ? 'on' : ''} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="b-rail__foot">
        <span className="av">{avatar}</span>
        <span className="who">{who}</span>
      </div>
    </aside>
  );
}
