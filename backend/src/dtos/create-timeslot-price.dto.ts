import { IsString, IsInt } from 'class-validator';

export class CreateTimeSlotPriceDto {
  @IsString()
  tenantId: string;

  @IsString()
  serviceId: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsInt()
  price: number;
}
