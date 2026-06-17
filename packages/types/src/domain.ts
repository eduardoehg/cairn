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

/** Body of PATCH /current-week/tasks/:taskId. */
export interface UpdateTaskStatusRequest {
  status: TaskStatus;
  /** Only meaningful when status = 'not_done'. */
  incompleteReason?: string;
}

/** Lifecycle status of a track. */
export type TrackStatus = 'active' | 'paused' | 'done';

/** An orchestration track (trilha) — the central domain entity (spec §3/§7). */
export interface Track {
  id: string;
  /** Short code shown in the UI, e.g. "PORT". */
  code: string;
  name: string;
  /** Short label for the sidebar. */
  short: string;
  type: TrackType;
  /** Objetivo/descrição da trilha. */
  goal: string;
  status: TrackStatus;
  /** Ordering hint for week generation (spec §4, rule 1). Higher = first. */
  priority: number;
  /** Project tracks: 0–100. Null for cadences. */
  progress: number | null;
  /** Cadence tracks: human descriptor, e.g. "1 post / week". Null for projects. */
  cadence: string | null;
  /** Cadence tracks: consecutive weeks on rhythm. */
  streak: number;
  createdAt: string;
  updatedAt: string;
}

/** Body of POST /tracks. */
export interface CreateTrackRequest {
  code: string;
  name: string;
  short?: string;
  type: TrackType;
  goal: string;
  priority?: number;
  /** Only for project tracks (0–100). */
  progress?: number;
  /** Only for cadence tracks. */
  cadence?: string;
}

/** Body of PATCH /tracks/:id — every field optional. */
export type UpdateTrackRequest = Partial<CreateTrackRequest> & {
  status?: TrackStatus;
  streak?: number;
};

/** LLM providers selectable for week generation (runtime). */
export type ProviderName = 'claude' | 'openai' | 'gemini';

/** Body of POST /current-week/generate. */
export interface GenerateWeekRequest {
  provider?: ProviderName;
}
