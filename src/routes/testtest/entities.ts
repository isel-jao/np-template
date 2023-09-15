import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsEmail } from '@/utils/validations';

export class TestTestDto {
  @ApiProperty({ required: false })
  testId: string;
  @ApiProperty({ required: true })
  @IsEmail()
  name: string;
  @ApiProperty({ required: false })
  createdAt: Date;
  @ApiProperty({ required: false })
  updatedAt: Date;
}

export class CreateTestTestDto extends OmitType(TestTestDto, [
  'testId',
  'createdAt',
  'updatedAt',
]) {}
export class UpdateTestTestDto extends PartialType(CreateTestTestDto) {}
