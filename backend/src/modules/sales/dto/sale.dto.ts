import { IsUUID, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  OTHER = 'OTHER',
}

export class CreateSaleDto {
  @IsUUID()
  order_id!: string;

  @IsNumber()
  @Min(0)
  subtotal!: number;

  @IsNumber()
  @Min(0)
  tax!: number;

  @IsNumber()
  @Min(0)
  total!: number;

  @IsEnum(PaymentMethod)
  payment_method!: PaymentMethod;

  @IsOptional()
  @IsUUID()
  cashier_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tip?: number;
}
