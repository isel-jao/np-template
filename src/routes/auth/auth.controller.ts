import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  verify(@Req() req: any) {
    const userId: number = req.userId;
    return this.authService.verifyToken(userId);
  }
}
