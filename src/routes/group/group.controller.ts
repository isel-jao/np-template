import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FindAllQuery, FindOneQuery } from '@/utils/types';
import { GroupService } from './group.service';
import { GroupDto, CreateGroupDto, UpdateGroupDto } from './entities';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOkResponse({ type: [GroupDto] })
  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.groupService.findAll(query);
  }

  @ApiOkResponse({ type: GroupDto })
  @Get(':id')
  findOne(@Query() query: FindOneQuery, @Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(+id, query);
  }

  @ApiOkResponse({ type: GroupDto })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.remove(+id);
  }

  @ApiCreatedResponse({ type: GroupDto })
  @Post()
  create(@Body() data: CreateGroupDto) {
    return this.groupService.create(data);
  }

  @ApiOkResponse({ type: GroupDto })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateGroupDto) {
    return this.groupService.update(+id, data);
  }
}
