import {
  IsString,
  IsNotEmpty,
  IsPositive,
  Min,
  Max,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum Rules {
  ALWAYS = 'always',
  INVOICE_ONLY = 'invoice_only',
  NEVER = 'never',
}

enum Brands {
  AMEX = 'Amex',
  ELO = 'Elo',
  MASTER = 'Mastercard',
  VISA = 'Visa',
  OUTRO = 'Outros',
}

enum Status {
  ACTIVE = 'Ativo',
  BLOCKED = 'Bloqueado',
  CANCELLED = 'Cancelado',
  PENDING = 'Pendente',
}

export class CardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastNumbers: string;

  @Transform(({ obj }) => parseFloat(obj.limit))
  @IsNumber()
  @IsPositive()
  limit: number;

  @Transform(({ obj }) => parseInt(obj.closingDay))
  @IsNumber()
  @Min(1)
  @Max(31)
  closingDay: number;

  @Transform(({ obj }) => parseInt(obj.dueDay))
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;

  @Transform(({ obj }) => parseFloat(obj.annuity))
  @IsNumber()
  @IsPositive()
  annuity: number;

  @Transform(({ obj }) => parseFloat(obj.fees))
  @IsNumber()
  @Min(0)
  fees: number;

  @IsString()
  @IsEnum(Rules)
  chargeRule: string;

  @IsString()
  @IsEnum(Brands)
  brand: string;

  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @IsString()
  @IsEnum(Status)
  status: string;
}
