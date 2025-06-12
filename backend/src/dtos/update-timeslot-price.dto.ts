import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateTimeSlotPriceDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  price?: number;
}
