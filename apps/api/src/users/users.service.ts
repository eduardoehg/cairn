import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import type { UpdateProfileRequest, UserProfile } from '@cairn/types';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  create(email: string, passwordHash: string): Promise<User> {
    const user = this.users.create({ email, passwordHash });
    return this.users.save(user);
  }

  async setRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    await this.users.update({ id }, { refreshTokenHash: hash });
  }

  // ── Perfil (Fatia 3 — settings) ──────────────────────────────────────────
  async getProfile(id: string): Promise<UserProfile> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toProfile(user);
  }

  async updateProfile(id: string, dto: UpdateProfileRequest): Promise<UserProfile> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (dto.email !== undefined && dto.email !== user.email) {
      const taken = await this.findByEmail(dto.email);
      if (taken) {
        throw new ConflictException('E-mail já está em uso');
      }
      user.email = dto.email;
    }
    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();
      user.name = trimmed === '' ? null : trimmed;
    }
    if (dto.weeklyBudgetHours !== undefined) {
      user.weeklyBudgetHours = dto.weeklyBudgetHours;
    }
    await this.users.save(user);
    return this.toProfile(user);
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await argon2.verify(user.passwordHash, currentPassword))) {
      throw new UnauthorizedException('Senha atual incorreta');
    }
    user.passwordHash = await argon2.hash(newPassword);
    await this.users.save(user);
  }

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      weeklyBudgetHours: user.weeklyBudgetHours,
    };
  }
}
