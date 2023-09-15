import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsEmail,
  IsPassword,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  IsEnum,
  ValidateNested,
} from '@/utils/validations';
import { Gender, Role } from '@prisma/client';
import { safeParse } from '@/utils/';
import { Transform, Type } from 'class-transformer';
import { CreatePostDto } from '../post/entities';

export class UserDto {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
  @ApiProperty({ required: true })
  @IsPassword()
  password: string;
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  firstName: string;
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  middleName: string;
  @ApiProperty({ required: false })
  @Transform(({ value }) => safeParse(value))
  @IsInt()
  @IsOptional()
  age: number;
  @ApiProperty({ required: true, type: 'enum', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;
  @ApiProperty({ required: false })
  avatarUrl: string;
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  lastName: string;
  @ApiProperty({ required: false, type: 'enum', enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role: Role;
  @ApiProperty({ required: false })
  @Transform(({ value }) => safeParse(value))
  @IsOptional()
  attributes: any;
  @ApiProperty({ required: false })
  createdAt: Date;
  @ApiProperty({ required: false })
  updatedAt: Date;
  @ApiProperty({ required: true })
  @Transform(({ value }) => safeParse(value))
  @IsInt()
  groupId: number;
  @ApiProperty({ required: false, type: [CreatePostDto] })
  @Transform(({ value }) => safeParse(value))
  @ValidateNested({ each: true })
  @Type(() => CreatePostDto)
  @IsOptional()
  posts?: CreatePostDto[];
}

export class CreateUserDto extends OmitType(UserDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
