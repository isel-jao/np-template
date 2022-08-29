/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsEmail, IsInt, MinLength, IsString, IsOptional } from 'class-validator'
import { IsPassword, IsPhoneNumber } from 'src/utils';

export class Role {
  @ApiProperty({ required: false })
  @IsInt()
  id: number;
  @ApiProperty({ required: false })
  @IsString()
  name: string;
  @ApiProperty({ required: false })
  @IsDateString()
  createdAt: Date;
  @ApiProperty({ required: false })
  @IsDateString()
  updatedAt: Date;
}

export class CreateRoleDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;
}

export class UpdateRoleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;
}

