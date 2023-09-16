import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
  Max,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum Types {
  DF = 'DF',
  DV = 'DV',
  DA = 'DA',
  RF = 'RF',
  RV = 'RV',
  RA = 'RA',
}

export class StatementDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(Types)
  type: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subcategory: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ obj }) => parseFloat(obj.expectedValue))
  @IsNumber()
  @IsPositive()
  expectedValue: number;

  @Transform(({ obj }) => parseInt(obj.dueDay))
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;

  @Transform(({ obj }) => parseInt(obj.installments))
  @IsNumber()
  @Min(1)
  @Max(24)
  installments: number;

  @IsArray()
  @ArrayNotEmpty()
  months: any[];
}
