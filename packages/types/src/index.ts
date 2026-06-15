/**
 * Shared contracts between apps/api (NestJS) and apps/web (Next).
 * Project rule: contract types live here, never duplicated.
 * The NestJS DTOs (with class-validator) implement these interfaces.
 */
export * from './api';
export * from './auth';
export * from './domain';
