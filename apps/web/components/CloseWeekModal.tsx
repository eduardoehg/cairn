'use client';

import type { CurrentWeek } from '@cairn/types';
import { formatHours } from '@/lib/coach';

interface Props {
  week: CurrentWeek;
  usedHours: number;
  onClose: () => void;
}

/**
 * Revisão de fechamento da semana — 100% dados reais (concluídas, motivos,
 * horas). O diagnóstico estimado-vs-concluído e a geração da próxima semana
 * são o loop de IA da Fatia 3; aqui ficam sinalizados, não simulados.
 */
export function CloseWeekModal({ week, usedHours, onClose }: Props) {
  const done = week.tasks.filter((t) => t.status === 'done').length;

  return (
    <div
      className="sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="b-modal" role="dialog" aria-modal="true" aria-label="Fechar semana">
        <div className="b-modal__head">
          <span className="ttl">fechar_semana — revisão</span>
        </div>

        <div className="b-modal__body">
          <h4>
            {done}/{week.tasks.length} concluídas · {formatHours(usedHours)} usadas
          </h4>

          {week.tasks.map((t) => {
            const cls = t.status === 'done' ? 'ok' : t.status === 'not_done' ? 'no' : 'pend';
            const sym = t.status === 'done' ? '✓' : t.status === 'not_done' ? '✕' : '○';
            return (
              <div className="b-rev" key={t.id}>
                <span className={`st ${cls}`}>{sym}</span>
                <div className="tx">
                  <div>{t.description}</div>
                  {t.status === 'not_done' && (
                    <div className="m">motivo: {t.incompleteReason || '—'}</div>
                  )}
                </div>
                <span className="h">{formatHours(t.estimatedHours)}</span>
              </div>
            );
          })}

          <div className="b-diag" style={{ marginTop: 18 }}>
            <span className="av">C</span>
            <div>
              <div className="who">coach@diagnose</div>
              <div className="msg">
                O diagnóstico estimado-vs-concluído e a geração da próxima semana entram na{' '}
                <b>Fatia 3</b> — o loop de IA com saída estruturada validada. Por ora, isto é a
                revisão da semana.
              </div>
            </div>
          </div>
        </div>

        <div className="b-modal__foot">
          <button className="b-btn ghost" onClick={onClose}>
            fechar
          </button>
          <span className="sp" />
          <button className="b-btn" disabled title="Disponível na Fatia 3">
            gerar próxima →
          </button>
        </div>
      </div>
    </div>
  );
}
