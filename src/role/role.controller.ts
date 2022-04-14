import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role, CreateRoleDto, UpdateRoleDto } from './role.entities';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindAllQuery } from 'src/utils';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOkResponse({ type: [Role] })
  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.roleService.findAll(query);
  }

  @ApiOkResponse({ type: Role })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(+id);
  }

  @ApiCreatedResponse({ type: Role })
  @Post()
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data);
  }

  @ApiOkResponse({ type: Role })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto) {
    return this.roleService.update(id, data);
  }

  @ApiOkResponse({ type: Role })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
