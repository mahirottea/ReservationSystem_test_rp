import { IsInt, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  tenantId: string;

  @IsInt()
  firstTime: number;

  @IsInt()
  repeat: number;
}
