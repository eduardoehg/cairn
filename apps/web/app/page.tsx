'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CurrentWeek, TaskStatus } from '@cairn/types';
import { getCurrentWeek, logout, tokens, updateTaskStatus } from '@/lib/api';

export default function WeekPage() {
  const router = useRouter();
  const [week, setWeek] = useState<CurrentWeek | null>(null);

  useEffect(() => {
    if (!tokens.access()) {
      router.replace('/login');
      return;
    }
    getCurrentWeek()
      .then(setWeek)
      .catch(() => router.replace('/login'));
  }, [router]);

  const setStatus = useCallback(
    async (taskId: string, status: TaskStatus, incompleteReason?: string) => {
      const updated = await updateTaskStatus(taskId, { status, incompleteReason });
      setWeek(updated);
    },
    [],
  );

  async function onLogout() {
    await logout();
    router.replace('/login');
  }

  if (!week) {
    return (
      <main className="container">
        <p className="muted">Loading…</p>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="row between">
        <div>
          <h1>Week {week.number}</h1>
          <p className="muted">
            {week.percentComplete}% done · {week.estimatedHours}h planned
          </p>
        </div>
        <button className="ghost" onClick={onLogout}>
          Log out
        </button>
      </header>

      <ul className="tasks">
        {week.tasks.map((task) => (
          <li key={task.id} className="task">
            <div className="task-head">
              <span className={`badge ${task.stage}`}>{task.stage}</span>
              <span className="muted">{task.estimatedHours}h</span>
            </div>
            <p className="task-desc">{task.description}</p>
            <div className="row">
              <button
                className={`toggle done ${task.status === 'done' ? 'on' : ''}`}
                onClick={() => setStatus(task.id, 'done')}
              >
                ✅ Done
              </button>
              <button
                className={`toggle not_done ${task.status === 'not_done' ? 'on' : ''}`}
                onClick={() => setStatus(task.id, 'not_done', task.incompleteReason ?? '')}
              >
                ❌ Not done
              </button>
            </div>
            {task.status === 'not_done' && (
              <input
                className="reason"
                placeholder="Why not? (reason)"
                defaultValue={task.incompleteReason ?? ''}
                onBlur={(e) => setStatus(task.id, 'not_done', e.target.value)}
              />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
