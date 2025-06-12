import { IsString, IsBoolean } from 'class-validator';

export class CreateSchoolSettingDto {
  @IsString()
  tenantId: string;

  @IsString()
  billingType: string;

  @IsBoolean()
  allowMakeup: boolean;
}
