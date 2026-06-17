import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TrackStatus, TrackType } from '@cairn/types';

/** Trilha de orquestração (spec §3/§7). Gerenciada via CRUD (Fatia 3a). */
@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column()
  short!: string;

  @Column({ type: 'varchar' })
  type!: TrackType;

  @Column({ type: 'text' })
  goal!: string;

  @Column({ type: 'varchar', default: 'active' })
  status!: TrackStatus;

  @Column({ type: 'int', default: 0 })
  priority!: number;

  /** Projetos: 0–100. Null para cadências. */
  @Column({ type: 'int', nullable: true })
  progress!: number | null;

  /** Cadências: descritor do ritmo (ex.: "1 post / semana"). Null para projetos. */
  @Column({ type: 'varchar', nullable: true })
  cadence!: string | null;

  @Column({ type: 'int', default: 0 })
  streak!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
