import { IsOptional, IsArray, ValidateNested, IsInt, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStaffDto } from './create-staff.dto';
import { CreateServiceDto } from './create-service.dto';
import { CreateCouponDto } from './create-coupon.dto';

export class CreateSetupDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  tenant?: any;

  @IsOptional()
  admin?: any;

  @IsOptional()
  setting?: any;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStaffDto)
  staffList?: CreateStaffDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  menuList?: CreateServiceDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponDto)
  coupon?: CreateCouponDto;

  // Business-specific optional fields
  @IsOptional()
  @IsInt()
  deposit?: number;

  @IsOptional()
  @IsString()
  lateFee?: string;

  @IsOptional()
  @IsBoolean()
  useInventory?: boolean;

  @IsOptional()
  @IsArray()
  items?: any[];

  @IsOptional()
  @IsArray()
  events?: any[];

  @IsOptional()
  @IsArray()
  lessons?: any[];

  @IsOptional()
  @IsArray()
  instructors?: any[];
}
