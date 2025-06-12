import { IsString, IsOptional, IsDateString } from 'class-validator';

export class SimpleCreateReservationDto {
  @IsString()
  userName: string;

  @IsString()
  serviceName: string;

  @IsDateString()
  reservedAt: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  status: string;
}
