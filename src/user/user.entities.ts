/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsEmail, IsInt, MinLength, IsOptional } from 'class-validator'
import { IsPassword, IsPhoneNumber } from 'src/utils';

export class User {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: false })
  roleId: number;
  @ApiProperty({ required: false })
  firstName: string;
  @ApiProperty({ required: false })
  lastName: string;
  @ApiProperty({ required: false })
  middleName: string;
  @ApiProperty({ required: false })
  email: string;
  @ApiProperty({ required: false })
  isVerified: boolean;
  @ApiProperty({ required: false })
  expiryDate: Date;
  @ApiProperty({ required: false })
  phoneNumber: string;
  @ApiProperty({ required: false })
  birthDate: Date;
  @ApiProperty({ required: false })
  createdAt: Date;
  @ApiProperty({ required: false })
  updatedAt: Date;
}

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsInt()
  roleId: number;
  @ApiProperty({ required: true })
  @MinLength(2)
  firstName: string;
  @ApiProperty({ required: true })
  @MinLength(2)
  lastName: string;
  @ApiProperty({ required: true })
  @MinLength(2)
  @IsOptional()
  middleName: string;
  @ApiProperty({ required: true })
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty({ required: true })
  @IsBoolean()
  @IsOptional()
  isVerified: boolean;
  @ApiProperty({ required: true })
  @IsPassword()
  @IsOptional()
  password: string;
  @ApiProperty({ required: true })
  @IsDateString()
  @IsOptional()
  expiryDate: Date;
  @ApiProperty({ required: true })
  @MinLength(2)
  @IsOptional()
  phoneNumber: string;
  @ApiProperty({ required: true })
  @IsDateString()
  @IsOptional()
  birthDate: Date;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  roleId: number;
  @ApiProperty({ required: false })
  @MinLength(2)
  @IsOptional()
  firstName: string;
  @ApiProperty({ required: false })
  @MinLength(2)
  @IsOptional()
  lastName: string;
  @ApiProperty({ required: false })
  @MinLength(2)
  @IsOptional()
  middleName: string;
  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isVerified: boolean;
  @ApiProperty({ required: false })
  @IsPassword()
  @IsOptional()
  password: string;
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expiryDate: Date;
  @ApiProperty({ required: false })
  @MinLength(2)
  @IsOptional()
  phoneNumber: string;
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  birthDate: Date;
}
