import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsInt()
  duration: number; // 単位: 分

  @IsInt()
  price: number;

  @IsBoolean()
  allowMultiple: boolean;

  @IsString()
  tenantId: string;
}
