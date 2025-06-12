import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateSeatTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  capacity?: number;
}
