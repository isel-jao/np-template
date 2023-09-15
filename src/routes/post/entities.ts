import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsInt } from '@/utils/validations';

export class PostDto {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  content: string;
  @ApiProperty({ required: true })
  @IsInt()
  authorId: number;
  @ApiProperty({ required: false })
  createdAt: Date;
  @ApiProperty({ required: false })
  updatedAt: Date;
}

export class CreatePostDto extends OmitType(PostDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
export class UpdatePostDto extends PartialType(CreatePostDto) {}
