import { IsBoolean, IsString } from 'class-validator';

export class UpdateNotificationSettingDto {
  @IsString()
  tenantId: string;

  @IsBoolean()
  notifyReservation: boolean;

  @IsBoolean()
  notifyReminder: boolean;
}
