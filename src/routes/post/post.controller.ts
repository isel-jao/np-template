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
import { PostService } from './post.service';
import { PostDto, CreatePostDto, UpdatePostDto } from './entities';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({ type: [PostDto] })
  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.postService.findAll(query);
  }

  @ApiOkResponse({ type: PostDto })
  @Get(':id')
  findOne(@Query() query: FindOneQuery, @Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(+id, query);
  }

  @ApiOkResponse({ type: PostDto })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(+id);
  }

  @ApiCreatedResponse({ type: PostDto })
  @Post()
  create(@Body() data: CreatePostDto) {
    return this.postService.create(data);
  }

  @ApiOkResponse({ type: PostDto })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePostDto) {
    return this.postService.update(+id, data);
  }
}
