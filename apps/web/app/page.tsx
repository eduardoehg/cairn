'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CurrentWeek, Task, TaskStatus } from '@cairn/types';
import { getCurrentWeek, logout, tokens, updateTaskStatus } from '@/lib/api';
import { Rail } from '@/components/Rail';
import { WeekMain } from '@/components/WeekMain';
import { TracksMain } from '@/components/TracksMain';
import { CloseWeekModal } from '@/components/CloseWeekModal';
import type { Screen } from '@/lib/coach';

export default function DashboardPage() {
  const router = useRouter();
  const [week, setWeek] = useState<CurrentWeek | null>(null);
  const [screen, setScreen] = useState<Screen>('week');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!tokens.access()) {
      router.replace('/login');
      return;
    }
    getCurrentWeek()
      .then(setWeek)
      .catch(() => router.replace('/login'));
  }, [router]);

  // Clicar de novo no mesmo status volta a tarefa para "pending" (toggle).
  const onStatus = useCallback(async (task: Task, status: TaskStatus) => {
    const next: TaskStatus = task.status === status ? 'pending' : status;
    const incompleteReason = next === 'not_done' ? (task.incompleteReason ?? '') : undefined;
    try {
      const updated = await updateTaskStatus(task.id, { status: next, incompleteReason });
      setWeek(updated);
    } catch {
      // mantém o estado atual; um refetch futuro reconcilia
    }
  }, []);

  const onReason = useCallback(async (task: Task, incompleteReason: string) => {
    try {
      const updated = await updateTaskStatus(task.id, { status: 'not_done', incompleteReason });
      setWeek(updated);
    } catch {
      // idem
    }
  }, []);

  const onLogout = useCallback(async () => {
    await logout();
    router.replace('/login');
  }, [router]);

  const usedHours = useMemo(
    () =>
      week
        ? week.tasks.filter((t) => t.status === 'done').reduce((s, t) => s + t.estimatedHours, 0)
        : 0,
    [week],
  );

  const decidedCount = useMemo(
    () => (week ? week.tasks.filter((t) => t.status !== 'pending').length : 0),
    [week],
  );

  if (!week) {
    return <div className="b-loading mono">carregando semana…</div>;
  }

  return (
    <div className="b-shell">
      <Rail screen={screen} onScreen={setScreen} weekNumber={week.number} />
      {screen === 'week' ? (
        <WeekMain
          week={week}
          usedHours={usedHours}
          onStatus={onStatus}
          onReason={onReason}
          onLogout={onLogout}
          onClose={() => setClosing(true)}
          closeDisabled={decidedCount === 0}
        />
      ) : (
        <TracksMain onLogout={onLogout} />
      )}
      {closing && (
        <CloseWeekModal week={week} usedHours={usedHours} onClose={() => setClosing(false)} />
      )}
    </div>
  );
}
