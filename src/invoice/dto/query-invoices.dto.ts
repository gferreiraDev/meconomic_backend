import { IsDate, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryInvoiceDto {
  @IsOptional()
  @IsString()
  cardId: string;

  @IsOptional()
  @Transform(({ obj }) => new Date(obj.dueDate))
  @IsDate()
  dueDate: Date;
}
