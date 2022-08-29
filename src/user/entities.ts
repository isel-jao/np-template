/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsEmail, IsInt, MinLength, IsString, IsOptional } from 'class-validator'
import { IsPassword, IsPhoneNumber } from 'src/utils';

export class User {
  @ApiProperty({ required: false })
  @IsInt()
  id: number;
  @ApiProperty({ required: false })
  @IsInt()
  roleId: number;
  @ApiProperty({ required: false })
  @IsString()
  email: string;
  @ApiProperty({ required: false })
  @IsString()
  firstName: string;
  @ApiProperty({ required: false })
  @IsString()
  lastName: string;
  @ApiProperty({ required: false })
  @IsString()
  middleName: string;
  @ApiProperty({ required: false })
  @IsString()
  avatar: string;
  @ApiProperty({ required: false })
  @IsDateString()
  createdAt: Date;
  @ApiProperty({ required: false })
  @IsDateString()
  updatedAt: Date;
}

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  roleId: number;
  @ApiProperty({ required: true })
  @IsString()
  email: string;
  @ApiProperty({ required: true })
  @IsString()
  firstName: string;
  @ApiProperty({ required: true })
  @IsString()
  lastName: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  middleName: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar: string;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  roleId: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  middleName: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar: string;
}

