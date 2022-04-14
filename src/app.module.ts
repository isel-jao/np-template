import { SampleModule } from './sample/sample.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [SampleModule, ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
