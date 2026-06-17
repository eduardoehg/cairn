'use client';

import type { CSSProperties } from 'react';
import type { CurrentWeek, Task, TaskStatus } from '@cairn/types';
import { MOTIVOS, STAGE_META, STAGE_ORDER, clampPct, formatHours, stageColor, weekRange } from '@/lib/coach';
import { TopbarActions } from './TopbarActions';

interface TaskRowProps {
  task: Task;
  onStatus: (task: Task, status: TaskStatus) => void;
  onReason: (task: Task, reason: string) => void;
}

function TaskRow({ task, onStatus, onReason }: TaskRowProps) {
  const meta = STAGE_META[task.stage];
  return (
    <div className="b-task" data-status={task.status}>
      <div className="b-task__row">
        <button className="b-check" title="Marcar como feita" onClick={() => onStatus(task, 'done')}>
          ✓
        </button>
        <div className="b-task__main">
          <div className="b-task__desc">{task.description}</div>
          <div className="b-task__meta">
            <span>{formatHours(task.estimatedHours)}</span>
            <span>·</span>
            <span className="b-stage" style={{ '--stage-c': stageColor(task.stage) } as CSSProperties}>
              {meta.label}
            </span>
          </div>
        </div>
        <div className="b-task__act">
          {/* Tutor — Fatia 4. Placeholder por enquanto. */}
          <button onClick={() => alert('Tutor "Aprofundar" — chega na Fatia 4.')}>aprofundar</button>
          <button onClick={() => alert('Tutor "Me ajuda a postar" — chega na Fatia 4.')}>postar</button>
          <button
            className="x"
            aria-pressed={task.status === 'not_done'}
            title="Marcar como não feita"
            onClick={() => onStatus(task, 'not_done')}
          >
            ✕
          </button>
        </div>
      </div>
      {task.status === 'not_done' && (
        <div className="b-motivo">
          <span className="lbl">motivo:</span>
          <select value={task.incompleteReason ?? ''} onChange={(e) => onReason(task, e.target.value)}>
            <option value="">selecione…</option>
            {MOTIVOS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

interface Props {
  week: CurrentWeek;
  usedHours: number;
  /** Orçamento de tempo do usuário (horas). Teto = ×1.25. */
  budgetHours: number;
  onStatus: (task: Task, status: TaskStatus) => void;
  onReason: (task: Task, reason: string) => void;
  onLogout: () => void;
  onClose: () => void;
  closeDisabled: boolean;
}

/** Tela "Semana atual" — tarefas reais da API, agrupadas por etapa do funil. */
export function WeekMain({
  week,
  usedHours,
  budgetHours,
  onStatus,
  onReason,
  onLogout,
  onClose,
  closeDisabled,
}: Props) {
  const capHours = budgetHours * 1.25;
  const groups = STAGE_ORDER.map((stage) => ({
    stage,
    items: week.tasks.filter((t) => t.stage === stage),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="b-main">
      <div className="b-topbar">
        <div className="wk">
          <span className="n">Semana {week.number}</span>
          <span className="r">{weekRange(week.startDate)}</span>
        </div>
        <div className="b-meter">
          <div className="nums">
            <span>
              <b>{formatHours(usedHours)}</b> usadas
            </span>
            <span>
              orçamento {formatHours(budgetHours)} · teto {formatHours(capHours)}
            </span>
          </div>
          <div className="bar">
            <i style={{ width: `${clampPct(usedHours, capHours)}%` }} />
            <span className="cap" style={{ left: `${(budgetHours / capHours) * 100}%` }} />
          </div>
        </div>
        <TopbarActions onLogout={onLogout} onClose={onClose} closeDisabled={closeDisabled} />
      </div>

      <div className="b-body">
        {groups.map((g) => {
          const meta = STAGE_META[g.stage];
          return (
            <div key={g.stage}>
              <div className="b-grouphead">
                <span className="code">{meta.glyph}</span>
                <span className="nm">{meta.label.charAt(0).toUpperCase() + meta.label.slice(1)}</span>
                <span className="ty">etapa</span>
                <span className="ln" />
              </div>
              {g.items.map((t) => (
                <TaskRow key={t.id} task={t} onStatus={onStatus} onReason={onReason} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
