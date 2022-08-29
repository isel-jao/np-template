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
import { UserService } from './user.service';
import { User, CreateUserDto, UpdateUserDto } from './entities';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindAllQuery, FindOneQuery } from 'src/utils';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({ type: [User] })
  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.userService.findAll(query);
  }

  @ApiOkResponse({ type: User })
  @Get(':id')
  findOne(@Query() query: FindOneQuery, @Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id, query);
  }

  @ApiCreatedResponse({ type: User })
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @ApiOkResponse({ type: User })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @ApiOkResponse({ type: User })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
