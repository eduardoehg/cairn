'use client';

import { type FormEvent, useState } from 'react';
import type { CreateTrackRequest, Track, TrackType, UpdateTrackRequest } from '@cairn/types';

interface Props {
  /** Ausente = criar; presente = editar. */
  track?: Track;
  onClose: () => void;
  onSubmit: (payload: CreateTrackRequest | UpdateTrackRequest) => Promise<void>;
}

/** Modal de criar/editar trilha — reaproveita o visual do CloseWeekModal (Fatia 3a). */
export function TrackForm({ track, onClose, onSubmit }: Props) {
  const editing = Boolean(track);
  const [code, setCode] = useState(track?.code ?? '');
  const [name, setName] = useState(track?.name ?? '');
  const [short, setShort] = useState(track?.short ?? '');
  const [type, setType] = useState<TrackType>(track?.type ?? 'project');
  const [goal, setGoal] = useState(track?.goal ?? '');
  const [progress, setProgress] = useState(track?.progress != null ? String(track.progress) : '0');
  const [cadence, setCadence] = useState(track?.cadence ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const base = { code, name, short: short || name, type, goal };
      const payload: CreateTrackRequest | UpdateTrackRequest =
        type === 'project'
          ? { ...base, progress: Number(progress) || 0 }
          : { ...base, cadence };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="b-modal" onSubmit={submit} role="dialog" aria-modal="true">
        <div className="b-modal__head">
          <span className="ttl">{editing ? 'editar_trilha' : 'nova_trilha'}</span>
        </div>

        <div className="b-modal__body">
          <div className="b-field">
            <label htmlFor="tf-type">tipo</label>
            <select id="tf-type" value={type} onChange={(e) => setType(e.target.value as TrackType)}>
              <option value="project">projeto (tem fim)</option>
              <option value="cadence">cadência (recorrente)</option>
            </select>
          </div>
          <div className="b-field">
            <label htmlFor="tf-code">code</label>
            <input
              id="tf-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={12}
              required
              placeholder="PORT"
            />
          </div>
          <div className="b-field">
            <label htmlFor="tf-name">nome</label>
            <input
              id="tf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Projeto de portfólio"
            />
          </div>
          <div className="b-field">
            <label htmlFor="tf-short">label curto (sidebar)</label>
            <input
              id="tf-short"
              value={short}
              onChange={(e) => setShort(e.target.value)}
              placeholder="(usa o nome se vazio)"
            />
          </div>
          <div className="b-field">
            <label htmlFor="tf-goal">objetivo</label>
            <textarea
              id="tf-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={2}
              required
              placeholder="O que essa trilha busca"
            />
          </div>
          {type === 'project' ? (
            <div className="b-field">
              <label htmlFor="tf-progress">progresso (%)</label>
              <input
                id="tf-progress"
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
            </div>
          ) : (
            <div className="b-field">
              <label htmlFor="tf-cadence">ritmo</label>
              <input
                id="tf-cadence"
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                placeholder="1 post / semana"
              />
            </div>
          )}
          {error && <p className="err">{error}</p>}
        </div>

        <div className="b-modal__foot">
          <button type="button" className="b-btn ghost" onClick={onClose}>
            cancelar
          </button>
          <span className="sp" />
          <button type="submit" className="b-btn" disabled={saving}>
            {saving ? 'salvando…' : 'salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
