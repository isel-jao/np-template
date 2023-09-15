import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './entities';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from '@/utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async verifyToken(userId: number | undefined) {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (err) {
      throw new UnauthorizedException(err.message || 'Invalid Token');
    }
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return;
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid Password');
    const accessToken = generateAccessToken({ id: user.id, email });
    const refreshToken = generateRefreshToken({ id: user.id, email });
    await this.cacheManager.set(refreshToken, user.id);
    return { accessToken, refreshToken };
  }
}
