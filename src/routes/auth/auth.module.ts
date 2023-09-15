import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [PrismaModule, CacheModule.register()],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
