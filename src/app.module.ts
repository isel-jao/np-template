import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UserModule, RoleModule, ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
