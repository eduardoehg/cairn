import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  /** Hash of the current refresh token (rotation + revocation). Null = no session. */
  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true })
  refreshTokenHash!: string | null;

  /** Display name (profile). */
  @Column({ type: 'varchar', nullable: true })
  name!: string | null;

  /** Weekly available time (hours) — the budget week generation respects. */
  @Column({ name: 'weekly_budget_hours', type: 'real', default: 6 })
  weeklyBudgetHours!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
