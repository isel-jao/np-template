import { Module } from '@nestjs/common';
import { TestTestService } from './testtest.service';
import { TestTestController } from './testtest.controller';
import { PrismaModule } from '@/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestTestController],
  providers: [TestTestService],
})
export class TestTestModule {}
