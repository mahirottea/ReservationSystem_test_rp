import { IsString, IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  tenantId: string;

  @IsString()
  name: string;

  @IsDateString()
  date: string | Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsInt()
  capacity: number;
}
