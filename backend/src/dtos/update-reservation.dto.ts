import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateReservationDto {

  @IsNotEmpty()
  @IsString()
  date: string; // ISO形式推奨

  @IsNotEmpty()
  @IsString()
  staffId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  serviceIds: string[];

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsOptional()
  @IsString()
  status?: string;

}
