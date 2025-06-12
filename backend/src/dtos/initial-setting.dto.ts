import { IsString, IsOptional, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class InitialSettingDto {
  @IsString()
  type: string;

  @IsOptional()
  data: any; // ← これが必要（ネストJSON構造で保存する用）
}
