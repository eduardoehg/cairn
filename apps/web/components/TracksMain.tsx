'use client';

import { useState } from 'react';
import type { CreateTrackRequest, Track, UpdateTrackRequest } from '@cairn/types';
import { TopbarActions } from './TopbarActions';
import { TrackForm } from './TrackForm';

interface Props {
  tracks: Track[];
  onCreate: (body: CreateTrackRequest) => Promise<void>;
  onUpdate: (id: string, body: UpdateTrackRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onLogout: () => void;
}

type FormState = { mode: 'closed' } | { mode: 'new' } | { mode: 'edit'; track: Track };

/** Tela "Trilhas" — projetos (têm fim) vs cadências (recorrentes). CRUD real (Fatia 3a). */
export function TracksMain({ tracks, onCreate, onUpdate, onDelete, onLogout }: Props) {
  const [form, setForm] = useState<FormState>({ mode: 'closed' });
  const projetos = tracks.filter((t) => t.type === 'project');
  const cadencias = tracks.filter((t) => t.type === 'cadence');

  async function handleSubmit(payload: CreateTrackRequest | UpdateTrackRequest) {
    if (form.mode === 'edit') {
      await onUpdate(form.track.id, payload);
    } else {
      await onCreate(payload as CreateTrackRequest);
    }
  }

  async function handleDelete(track: Track) {
    if (window.confirm(`Excluir a trilha "${track.name}"?`)) {
      await onDelete(track.id);
    }
  }

  return (
    <div className="b-main">
      <div className="b-topbar">
        <div className="wk">
          <span className="n">Trilhas</span>
          <span className="r">
            {projetos.length} projetos · {cadencias.length} cadências
          </span>
        </div>
        <span style={{ flex: 1 }} />
        <button type="button" className="b-btn" onClick={() => setForm({ mode: 'new' })}>
          + nova trilha
        </button>
        <TopbarActions onLogout={onLogout} />
      </div>

      <div className="b-body">
        <div className="b-tcol">
          <div className="b-tsec">
            <h3>Projetos // têm fim</h3>
            <p className="d">Progresso caminha até concluir.</p>
            {projetos.length === 0 && <p className="d">Nenhum projeto ainda.</p>}
            {projetos.map((t) => {
              const pct = t.progress ?? 0;
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
                  <div className="tc-act">
                    <button type="button" onClick={() => setForm({ mode: 'edit', track: t })}>
                      editar
                    </button>
                    <button type="button" className="del" onClick={() => handleDelete(t)}>
                      excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="b-tsec">
            <h3>Cadências // recorrentes</h3>
            <p className="d">Sem fim. O que conta é o ritmo.</p>
            {cadencias.length === 0 && <p className="d">Nenhuma cadência ainda.</p>}
            {cadencias.map((t) => {
              const streak = t.streak ?? 0;
              const filled = Math.min(streak, 5);
              return (
                <div className="b-tcard cad" key={t.id}>
                  <div className="tc-top">
                    <span className="tc-code">{t.code}</span>
                    <span className="tc-name">{t.name}</span>
                  </div>
                  <div className="tc-goal">
                    {t.cadence ?? '—'} · streak {streak}
                  </div>
                  <div className="tc-cells">
                    {['S1', 'S2', 'S3', 'S4', 'S5'].map((s, i) => (
                      <span key={s} className={i < filled ? 'on' : ''}>
                        {i < filled ? '✓' : s}
                      </span>
                    ))}
                  </div>
                  <div className="tc-act">
                    <button type="button" onClick={() => setForm({ mode: 'edit', track: t })}>
                      editar
                    </button>
                    <button type="button" className="del" onClick={() => handleDelete(t)}>
                      excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {form.mode !== 'closed' && (
        <TrackForm
          track={form.mode === 'edit' ? form.track : undefined}
          onClose={() => setForm({ mode: 'closed' })}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
