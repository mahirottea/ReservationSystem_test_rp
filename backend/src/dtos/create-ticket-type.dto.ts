import { IsString, IsInt } from 'class-validator';

export class CreateTicketTypeDto {
  @IsString()
  eventId: string;

  @IsString()
  type: string;

  @IsInt()
  price: number;

  @IsInt()
  quantity: number;
}
