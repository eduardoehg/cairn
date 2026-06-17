import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly repo: Repository<Track>,
  ) {}

  list(userId: string): Promise<Track[]> {
    return this.repo.find({
      where: { userId },
      order: { priority: 'DESC', createdAt: 'ASC' },
    });
  }

  create(userId: string, dto: CreateTrackDto): Promise<Track> {
    const isProject = dto.type === 'project';
    const track = this.repo.create({
      userId,
      code: dto.code,
      name: dto.name,
      short: dto.short ?? dto.name,
      type: dto.type,
      goal: dto.goal,
      priority: dto.priority ?? 0,
      progress: isProject ? (dto.progress ?? 0) : null,
      cadence: isProject ? null : (dto.cadence ?? null),
    });
    return this.repo.save(track);
  }

  async update(userId: string, id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.repo.findOne({ where: { id, userId } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    // Aplica só os campos enviados (DTO traz undefined nos ausentes).
    if (dto.code !== undefined) track.code = dto.code;
    if (dto.name !== undefined) track.name = dto.name;
    if (dto.short !== undefined) track.short = dto.short;
    if (dto.type !== undefined) track.type = dto.type;
    if (dto.goal !== undefined) track.goal = dto.goal;
    if (dto.status !== undefined) track.status = dto.status;
    if (dto.priority !== undefined) track.priority = dto.priority;
    if (dto.progress !== undefined) track.progress = dto.progress;
    if (dto.cadence !== undefined) track.cadence = dto.cadence;
    if (dto.streak !== undefined) track.streak = dto.streak;
    return this.repo.save(track);
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await this.repo.delete({ id, userId });
    if (!result.affected) {
      throw new NotFoundException('Track not found');
    }
  }
}
