import { IsString, IsDateString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  customerId: string;

  @IsString()
  staffId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  serviceIds: string[];


  @IsDateString()
  date: string;

  @IsString()
  tenantId: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
