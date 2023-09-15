import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FindAllQuery, FindOneQuery } from '@/utils/types';
import { TestTestService } from './testtest.service';
import { TestTestDto, CreateTestTestDto, UpdateTestTestDto } from './entities';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('testtest')
@Controller('testtest')
export class TestTestController {
  constructor(private readonly testtestService: TestTestService) {}

  @ApiOkResponse({ type: [TestTestDto] })
  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.testtestService.findAll(query);
  }

  @ApiOkResponse({ type: TestTestDto })
  @Get(':id')
  findOne(@Query() query: FindOneQuery, @Param('id') id: string) {
    return this.testtestService.findOne(id, query);
  }

  @ApiOkResponse({ type: TestTestDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testtestService.remove(id);
  }

  @ApiCreatedResponse({ type: TestTestDto })
  @Post()
  create(@Body() data: CreateTestTestDto) {
    return this.testtestService.create(data);
  }

  @ApiOkResponse({ type: TestTestDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateTestTestDto) {
    return this.testtestService.update(id, data);
  }
}
