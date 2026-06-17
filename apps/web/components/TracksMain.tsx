'use client';

import { MOCK_TRACKS } from '@/lib/coach';
import { TopbarActions } from './TopbarActions';

interface Props {
  onLogout: () => void;
}

/** Tela "Trilhas" — projetos (têm fim) vs cadências (recorrentes). Mock (Fatia 3). */
export function TracksMain({ onLogout }: Props) {
  const projetos = MOCK_TRACKS.filter((t) => t.type === 'projeto');
  const cadencias = MOCK_TRACKS.filter((t) => t.type === 'cadencia');

  return (
    <div className="b-main">
      <div className="b-topbar">
        <div className="wk">
          <span className="n">Trilhas</span>
          <span className="r">
            {projetos.length} projetos · {cadencias.length} cadências · mock
          </span>
        </div>
        <span style={{ flex: 1 }} />
        <TopbarActions onLogout={onLogout} />
      </div>

      <div className="b-body">
        <div className="b-tcol">
          <div className="b-tsec">
            <h3>Projetos // têm fim</h3>
            <p className="d">Progresso caminha até concluir.</p>
            {projetos.map((t) => {
              const pct = Math.round((t.progress ?? 0) * 100);
              return (
                <div className="b-tcard" key={t.id}>
                  <div className="tc-top">
                    <span className="tc-code">{t.code}</span>
                    <span className="tc-name">{t.name}</span>
                  </div>
                  <div className="tc-goal">{t.goal}</div>
                  <div className="tc-bar">
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  <div className="tc-pct">
                    <span>{pct}% done</span>
                    <span>{100 - pct}% left</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="b-tsec">
            <h3>Cadências // recorrentes</h3>
            <p className="d">Sem fim. O que conta é o ritmo.</p>
            {cadencias.map((t) => {
              const streak = t.streak ?? 0;
              return (
                <div className="b-tcard cad" key={t.id}>
                  <div className="tc-top">
                    <span className="tc-code">{t.code}</span>
                    <span className="tc-name">{t.name}</span>
                  </div>
                  <div className="tc-goal">
                    {t.cadence} · streak {streak}
                  </div>
                  <div className="tc-cells">
                    {['S1', 'S2', 'S3', 'S4', 'S5'].map((s, i) => (
                      <span key={s} className={i < streak ? 'on' : ''}>
                        {i < streak ? '✓' : s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
