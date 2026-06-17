import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import type { UserProfile } from '@cairn/types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

// Conta do próprio usuário autenticado (protegido pelo JwtAuthGuard global).
@Controller('me')
export class MeController {
  constructor(private readonly users: UsersService) {}

  @Get()
  getMe(@CurrentUser() user: JwtPayload): Promise<UserProfile> {
    return this.users.getProfile(user.sub);
  }

  @Patch()
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto): Promise<UserProfile> {
    return this.users.updateProfile(user.sub, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password')
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return this.users.changePassword(user.sub, dto.currentPassword, dto.newPassword);
  }
}
