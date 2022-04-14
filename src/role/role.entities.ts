/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsEmail, IsInt, MinLength } from 'class-validator'
import { IsPassword, IsPhoneNumber } from 'src/utils';

export class Role {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  createdAt: Date;
  @ApiProperty({ required: false })
  updatedAt: Date;
}

export class CreateRoleDto {
  @ApiProperty({ required: true })
  @MinLength(2)
  name: string;
}

export class UpdateRoleDto {
  @ApiProperty({ required: false })
  @MinLength(2)
  name: string;
}
