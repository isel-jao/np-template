/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsEmail, IsInt, MinLength } from 'class-validator'
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
  middleName: string;
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
  @ApiProperty({ required: true })
  @IsBoolean()
  isVerified: boolean;
  @ApiProperty({ required: true })
  @IsPassword()
  password: string;
  @ApiProperty({ required: true })
  @IsDateString()
  expiryDate: Date;
  @ApiProperty({ required: true })
  @MinLength(2)
  phoneNumber: string;
  @ApiProperty({ required: true })
  @IsDateString()
  birthDate: Date;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsInt()
  roleId: number;
  @ApiProperty({ required: false })
  @MinLength(2)
  firstName: string;
  @ApiProperty({ required: false })
  @MinLength(2)
  lastName: string;
  @ApiProperty({ required: false })
  @MinLength(2)
  middleName: string;
  @ApiProperty({ required: false })
  @IsEmail()
  email: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  isVerified: boolean;
  @ApiProperty({ required: false })
  @IsPassword()
  password: string;
  @ApiProperty({ required: false })
  @IsDateString()
  expiryDate: Date;
  @ApiProperty({ required: false })
  @MinLength(2)
  phoneNumber: string;
  @ApiProperty({ required: false })
  @IsDateString()
  birthDate: Date;
}
