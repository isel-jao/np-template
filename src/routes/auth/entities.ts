import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPassword } from '@/utils/validations';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
  @ApiProperty({ required: true })
  @IsPassword()
  password: string;
}
