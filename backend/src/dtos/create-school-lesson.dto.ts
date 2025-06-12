import { IsString } from 'class-validator';

export class CreateSchoolLessonDto {
  @IsString()
  tenantId: string;

  @IsString()
  name: string;

  @IsString()
  day: string;

  @IsString()
  time: string;
}
