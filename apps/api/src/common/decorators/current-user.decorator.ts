import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../../auth/jwt-payload';

/** Injects the authenticated user (set by JwtAuthGuard) into the handler. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
