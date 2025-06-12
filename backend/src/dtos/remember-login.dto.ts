import { IsString } from "class-validator";

export class RememberLoginDto {
  @IsString()
  token: string;
}
