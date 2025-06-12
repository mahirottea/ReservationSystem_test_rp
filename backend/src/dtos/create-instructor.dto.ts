import { IsString } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  tenantId: string;

  @IsString()
  name: string;

  @IsString()
  subjects: string;
}
