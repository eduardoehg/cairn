/** Track type — the central domain distinction (see coach-spec.md §3). */
export type TrackType = 'project' | 'cadence';

/** Task stage in the build → show → visibility funnel (spec §4/§7). */
export type TaskStage = 'build' | 'show' | 'visibility';

/** Execution status of a task within the week. */
export type TaskStatus = 'pending' | 'done' | 'not_done';

/** A concrete task of the week (3–5 per week, atomic and checkable). */
export interface Task {
  id: string;
  description: string;
  estimatedHours: number;
  stage: TaskStage;
  status: TaskStatus;
  /** Filled when status = 'not_done' (input for the diagnosis). */
  incompleteReason?: string | null;
}

/** Contract for GET /current-week: the current week with its tasks. */
export interface CurrentWeek {
  id: string;
  number: number;
  /** ISO date (YYYY-MM-DD) of the week start. */
  startDate: string;
  /** Sum of estimates — budget ≤ ~6h, cap 7h30 (spec §4). */
  estimatedHours: number;
  percentComplete: number;
  tasks: Task[];
}
