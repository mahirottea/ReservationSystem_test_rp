import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateCarSettingDto {
  @IsString()
  tenantId: string;

  @IsInt()
  deposit: number;

  @IsString()
  lateFee: string;

  @IsBoolean()
  useInventory: boolean;
}
