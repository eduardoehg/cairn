import { SetMetadata } from '@nestjs/common';

/** Marks a handler/controller as public (bypasses the global JwtAuthGuard). */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
