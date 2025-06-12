import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsBoolean()
  selectable: boolean;

  @IsOptional()
  @IsString()
  specialties?: string;

  @IsString()
  tenantId: string;
}
