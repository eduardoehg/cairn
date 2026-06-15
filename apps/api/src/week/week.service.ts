import { Injectable } from '@nestjs/common';
import type { CurrentWeek } from '@cairn/types';

@Injectable()
export class WeekService {
  /**
   * Fatia 1: seed week (hardcoded). It goes away in Fatia 3, when AI generation
   * starts building and persisting the real week.
   *
   * The seed already honors the domain invariants: it orbits ONE work piece
   * (the API auth) touching build → show → visibility, and the estimates sum
   * (5.5h) fits the ~6h budget (spec §4).
   */
  getCurrentWeek(): CurrentWeek {
    return {
      id: 'seed-week-1',
      number: 1,
      startDate: '2026-06-15',
      estimatedHours: 5.5,
      percentComplete: 0,
      tasks: [
        {
          id: 'seed-t1',
          description: "Implement custom auth (JWT + guard) in Cairn's API",
          estimatedHours: 2.5,
          stage: 'build',
          status: 'pending',
          incompleteReason: null,
        },
        {
          id: 'seed-t2',
          description: 'Ship a protected GET /current-week returning the week',
          estimatedHours: 1.5,
          stage: 'show',
          status: 'pending',
          incompleteReason: null,
        },
        {
          id: 'seed-t3',
          description: 'Post on LinkedIn about writing auth from scratch in NestJS',
          estimatedHours: 1.5,
          stage: 'visibility',
          status: 'pending',
          incompleteReason: null,
        },
      ],
    };
  }
}
