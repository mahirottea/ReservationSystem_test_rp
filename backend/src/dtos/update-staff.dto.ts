import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  selectable?: boolean;

  @IsOptional()
  @IsString()
  specialties?: string;
}
