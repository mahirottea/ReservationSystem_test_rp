import { IsString, IsInt } from 'class-validator';

export class CreateSeatTypeDto {
  @IsString()
  name: string;

  @IsInt()
  capacity: number;

  @IsString()
  tenantId: string;
}
