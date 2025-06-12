import { IsString } from "class-validator";

export class DeleteTokenDto {
  @IsString()
  token: string;
}
