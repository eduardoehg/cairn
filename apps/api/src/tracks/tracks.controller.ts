import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './track.entity';
import { TracksService } from './tracks.service';

// Protegido pelo JwtAuthGuard global; tudo escopado ao usuário autenticado.
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracks: TracksService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload): Promise<Track[]> {
    return this.tracks.list(user.sub);
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateTrackDto): Promise<Track> {
    return this.tracks.create(user.sub, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<Track> {
    return this.tracks.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<void> {
    return this.tracks.remove(user.sub, id);
  }
}
