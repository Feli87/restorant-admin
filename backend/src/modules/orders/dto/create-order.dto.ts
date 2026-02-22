import { IsNotEmpty, IsString, IsUUID, IsOptional, IsArray, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';
import { OrderItemStatus } from '../entities/order-item.entity';

export class CreateOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  menu_item_id!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unit_price!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  table_id!: string;

  @IsOptional()
  @IsUUID()
  waiter_id?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  waiter_id?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;
}

export class UpdateOrderItemStatusDto {
  @IsEnum(OrderItemStatus)
  @IsNotEmpty()
  status!: OrderItemStatus;
}
