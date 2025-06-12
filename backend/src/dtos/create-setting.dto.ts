import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateSettingDto {
  @IsString()
  tenantId: string;

  @IsOptional()
  @IsInt()
  reservationMax?: number;

  @IsOptional()
  @IsBoolean()
  isUnlimited?: boolean;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  businessDays?: string[];

  @IsOptional()
  @IsString()
  closedDays?: string[];

  @IsOptional()
  @IsBoolean()
  requirePhone?: boolean;

  @IsOptional()
  @IsBoolean()
  requireEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyReservation?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyReminder?: boolean;

  @IsOptional()
  @IsBoolean()
  allowNomination?: boolean;

  @IsOptional()
  @IsBoolean()
  useIndividualStaffSlots?: boolean;
}
