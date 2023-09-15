import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from '@/utils/validations';

export class GroupDto {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;
}

export class CreateGroupDto extends OmitType(GroupDto, ['id']) {}
export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
