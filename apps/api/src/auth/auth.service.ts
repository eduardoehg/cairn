import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { AuthResponse, AuthTokens, PublicUser } from '@cairn/types';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import type { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(email: string, password: string): Promise<AuthResponse> {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await argon2.hash(password);
    const user = await this.users.create(email, passwordHash);
    return this.buildAuthResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.users.findByEmail(email);
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildAuthResponse(user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.users.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Session not found');
    }

    const matches = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!matches) {
      // Valid signature but does not match the current hash → rotated/reused
      // token: drop the session for safety.
      await this.users.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedException('Refresh token revoked');
    }

    return this.buildAuthResponse(user);
  }

  async logout(userId: string): Promise<void> {
    await this.users.setRefreshTokenHash(userId, null);
  }

  /** Issues a new token pair and rotates the stored refresh hash. */
  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const tokens = await this.generateTokens(user.id, user.email);
    const refreshHash = await argon2.hash(tokens.refreshToken);
    await this.users.setRefreshTokenHash(user.id, refreshHash);
    return { user: this.toPublicUser(user), tokens };
  }

  private async generateTokens(sub: string, email: string): Promise<AuthTokens> {
    // Random jti: ensures each issuance yields distinct tokens even within the
    // same second, so refresh rotation can detect reuse of an old token.
    const payload: JwtPayload = { sub, email, jti: randomUUID() };
    // expiresIn comes from config as a string ('15m'); @nestjs/jwt types it as
    // number | ms.StringValue, so we type the whole object as JwtSignOptions.
    const accessOptions = {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_TTL', '15m'),
    } as JwtSignOptions;
    const refreshOptions = {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_TTL', '7d'),
    } as JwtSignOptions;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, accessOptions),
      this.jwt.signAsync(payload, refreshOptions),
    ]);
    return { accessToken, refreshToken };
  }

  private toPublicUser(user: User): PublicUser {
    return { id: user.id, email: user.email };
  }
}
