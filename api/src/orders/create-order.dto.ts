import { Type } from "class-transformer";
import {
  Allow,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from "class-validator";

export class CreateOrderItemDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  // A manipulated price is accepted only to ignore it.
  @Allow()
  price?: unknown;
}

export class CreateOrderAddressDto {
  @IsString()
  @Matches(/\S/)
  firstName!: string;

  @IsString()
  @Matches(/\S/)
  lastName!: string;

  @IsString()
  @Matches(/\S/)
  phone!: string;

  @IsString()
  @Matches(/\S/)
  street!: string;

  @IsString()
  @Matches(/\S/)
  city!: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsString()
  @Matches(/^\d{5}$/)
  postalCode!: string;

  @IsString()
  @Matches(/\S/)
  country!: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique((item: CreateOrderItemDto) => item.productId)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  address!: CreateOrderAddressDto;
}
