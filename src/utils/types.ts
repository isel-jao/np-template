import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';

export class FindAllQuery {
  @ApiPropertyOptional()
  @IsOptional()
  skip?: number;
  @ApiPropertyOptional()
  @IsOptional()
  take?: number;
  @ApiPropertyOptional()
  @IsOptional()
  orderBy?: string;
  @ApiPropertyOptional()
  @IsOptional()
  include?: string;
  @ApiPropertyOptional()
  @IsOptional()
  select?: string;
  @IsOptional()
  where?: string;
}

export class FindOneQuery {
  @ApiPropertyOptional({
    type: 'string',
    description: `'field1, filde2.subfild' or '{"field1: "true" , "filde2" : {"subfild": "true" }}'(JSON string format)`,
  })
  @IsOptional()
  include?: string;
  @ApiPropertyOptional({
    type: 'string',
    description: `'field1, filde2.subfild' or '{"field1: "true" , "filde2" : {"subfild": "true" }}'(JSON string format)`,
  })
  @IsOptional()
  select?: string;
}

export type DecodedToken = {
  id: number;
  email: string;
  exp?: number;
  iat?: number;
};

export class DeleteManyDto {
  @ApiProperty({ type: [Number], required: false })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  ids?: number[];
}
