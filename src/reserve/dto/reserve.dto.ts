import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ReserveDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ obj }) => parseFloat(obj.amount))
  @IsNumber()
  amount: number;
}
