import {
  IsString,
  IsNotEmpty,
  IsPositive,
  Min,
  Max,
  IsNumber,
  IsEnum,
  IsDateString,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BillingTypes, BillingStatus } from '../../utils/enums';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(BillingTypes)
  type: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ obj }) => parseFloat(obj.value))
  @IsNumber()
  @IsPositive()
  value: number;

  @Transform(({ obj }) => new Date(obj.dueDate))
  @IsDate()
  dueDate: Date;

  @Transform(({ obj }) => new Date(obj.payDate))
  @IsDate()
  payDate: Date;

  @Transform(({ obj }) => parseInt(obj.installments))
  @IsNumber()
  @Min(1)
  @Max(24)
  installments: number;

  @Transform(({ obj }) => parseInt(obj.installment))
  @IsNumber()
  @Min(1)
  @Max(24)
  installment: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(BillingStatus)
  status: string;
}
