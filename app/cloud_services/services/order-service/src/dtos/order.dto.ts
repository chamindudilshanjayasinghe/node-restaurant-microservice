// src/dto/order.dto.ts
import {
  IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional,
  IsInt, Min, ValidateNested, IsString, IsPositive
} from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus, OrderType, PaymentStatus } from "shared-utils";

export class OrderItemDto {
  @IsMongoId()
  itemId!: string;

  @IsString() @IsNotEmpty()
  name!: string;

  @IsInt() @Min(0)
  price!: number;

  @IsInt() @IsPositive()
  quantity!: number;

  @IsInt() @Min(0)
  total!: number;

  @IsOptional()
  variations?: Record<string, any>;
}

export class OrderDto {
  @IsString() @IsNotEmpty()
  orderNo!: string;

  @IsEnum(OrderType)
  orderType!: OrderType;

  @IsOptional() @IsMongoId()
  customerId?: string;

  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;

  @IsInt() @Min(0)
  totalAmount!: number;

  @IsInt() @Min(0)
  paidAmount!: number;
}
