/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class Sample {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  createdAt: Date;
  @ApiProperty({ required: false })
  updatedAt: Date;
}

export class CreateSampleDto {
  @ApiProperty({ required: true })
  @MinLength(2)
  name: string;
}

export class UpdateSampleDto {
  @ApiProperty({ required: true })
  @MinLength(2)
  name: string;
}
