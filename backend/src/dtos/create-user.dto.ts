import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  tenantId: string;

  @IsString()
  @IsIn(['admin','user','staff'])
  role: string;

  @IsString()
  subRole?: string;
}
