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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { DeleteManyDto, FindAllQuery, FindOneQuery } from '@/utils/types';
import { UserService } from './user.service';
import { UserDto, CreateUserDto, UpdateUserDto } from './entities';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { storage } from '@/utils';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: [UserDto] })
  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.userService.findAll(query);
  }

  @ApiOkResponse({ type: UserDto })
  @Get(':id')
  findOne(@Query() query: FindOneQuery, @Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id, query);
  }

  @ApiOkResponse({ type: UserDto })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
  @ApiOkResponse({ type: UserDto })
  @Delete('deleteMany')
  removeMany(@Body() data: DeleteManyDto) {
    return this.userService.removeMany(data);
  }

  @ApiCreatedResponse({ type: UserDto })
  @Post()
  @UseInterceptors(FileInterceptor('avatarUrl', { storage }))
  async create(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    file: Express.Multer.File,
    @Body() data: CreateUserDto,
  ) {
    try {
      return await this.userService.create({
        ...data,
        avatarUrl: file?.filename,
      });
    } catch (e) {
      if (file) {
        storage._removeFile(null, file, () => {});
      }
      throw e;
    }
  }

  @ApiOkResponse({ type: UserDto })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatarUrl', { storage }))
  async update(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    try {
      return await this.userService.update(+id, {
        ...data,
        avatarUrl: file?.filename,
      });
    } catch (e) {
      if (file) {
        storage._removeFile(null, file, () => {});
      }
      throw e;
    }
  }
}
