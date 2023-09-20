import { IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class TransactionQueryDto {
  @IsOptional()
  @Transform(({ obj }) => new Date(obj.dueDate))
  @IsDate()
  dueDate: Date;
}
