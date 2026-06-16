import { Column, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import type { TaskStatus } from '@cairn/types';

/**
 * Persiste o status que o usuário marca em cada tarefa da semana.
 * Fatia 2: chaveado pelo id (string) da tarefa seed. Na Fatia 3, quando
 * tarefas viram entidades de verdade, isto é reabsorvido.
 */
@Entity('task_progress')
@Unique(['userId', 'taskId'])
export class TaskProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'task_id' })
  taskId!: string;

  @Column({ type: 'varchar' })
  status!: TaskStatus;

  @Column({ name: 'incomplete_reason', type: 'text', nullable: true })
  incompleteReason!: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
