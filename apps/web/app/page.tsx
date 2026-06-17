'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  ChangePasswordRequest,
  CreateTrackRequest,
  CurrentWeek,
  Task,
  TaskStatus,
  Track,
  UpdateProfileRequest,
  UpdateTrackRequest,
  UserProfile,
} from '@cairn/types';
import {
  changePassword,
  createTrack,
  deleteTrack,
  getCurrentWeek,
  getProfile,
  getTracks,
  logout,
  tokens,
  updateProfile,
  updateTaskStatus,
  updateTrack,
} from '@/lib/api';
import { Rail } from '@/components/Rail';
import { WeekMain } from '@/components/WeekMain';
import { TracksMain } from '@/components/TracksMain';
import { SettingsMain } from '@/components/SettingsMain';
import { CloseWeekModal } from '@/components/CloseWeekModal';
import type { Screen } from '@/lib/coach';

const DEFAULT_BUDGET_HOURS = 6;

export default function DashboardPage() {
  const router = useRouter();
  const [week, setWeek] = useState<CurrentWeek | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
    getTracks()
      .then(setTracks)
      .catch(() => {
        // falha de trilhas não derruba a sessão; o fetch da semana cuida do 401
      });
    getProfile()
      .then(setProfile)
      .catch(() => {
        // idem perfil
      });
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

  const reloadTracks = useCallback(() => getTracks().then(setTracks), []);
  const onCreateTrack = useCallback(
    async (body: CreateTrackRequest) => {
      await createTrack(body);
      await reloadTracks();
    },
    [reloadTracks],
  );
  const onUpdateTrack = useCallback(
    async (id: string, body: UpdateTrackRequest) => {
      await updateTrack(id, body);
      await reloadTracks();
    },
    [reloadTracks],
  );
  const onDeleteTrack = useCallback(
    async (id: string) => {
      await deleteTrack(id);
      await reloadTracks();
    },
    [reloadTracks],
  );

  const onSaveProfile = useCallback(async (body: UpdateProfileRequest) => {
    const updated = await updateProfile(body);
    setProfile(updated);
  }, []);
  const onChangePassword = useCallback(async (body: ChangePasswordRequest) => {
    await changePassword(body);
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

  const budgetHours = profile?.weeklyBudgetHours ?? DEFAULT_BUDGET_HOURS;

  return (
    <div className="b-shell">
      <Rail
        screen={screen}
        onScreen={setScreen}
        weekNumber={week.number}
        tracks={tracks}
        profile={profile}
      />

      {screen === 'week' && (
        <WeekMain
          week={week}
          usedHours={usedHours}
          budgetHours={budgetHours}
          onStatus={onStatus}
          onReason={onReason}
          onLogout={onLogout}
          onClose={() => setClosing(true)}
          closeDisabled={decidedCount === 0}
        />
      )}
      {screen === 'tracks' && (
        <TracksMain
          tracks={tracks}
          onCreate={onCreateTrack}
          onUpdate={onUpdateTrack}
          onDelete={onDeleteTrack}
          onLogout={onLogout}
        />
      )}
      {screen === 'settings' &&
        (profile ? (
          <SettingsMain
            profile={profile}
            onSaveProfile={onSaveProfile}
            onChangePassword={onChangePassword}
            onLogout={onLogout}
          />
        ) : (
          <div className="b-loading mono">carregando perfil…</div>
        ))}

      {closing && (
        <CloseWeekModal week={week} usedHours={usedHours} onClose={() => setClosing(false)} />
      )}
    </div>
  );
}
