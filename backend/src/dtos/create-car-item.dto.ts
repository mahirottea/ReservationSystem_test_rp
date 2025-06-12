import { IsString, IsInt } from 'class-validator';

export class CreateCarItemDto {
  @IsString()
  tenantId: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsInt()
  stock: number;
}
