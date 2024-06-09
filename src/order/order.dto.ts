import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productLine: { quantity: number; productId: Types.ObjectId }[];

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  constructor(
    productLine: { quantity: number; productId: Types.ObjectId }[],
    userId: string,
  ) {
    this.productLine = productLine;
    this.userId = userId;
  }
}

export class UpdateOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productLine: {
    id: Types.ObjectId;
    quantity: number;
    productId: Types.ObjectId;
  }[];

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  constructor(
    productLine: {
      id: Types.ObjectId;
      quantity: number;
      productId: Types.ObjectId;
    }[],
    userId: string,
  ) {
    this.productLine = productLine;
    this.userId = userId;
  }
}
export default CreateOrderDto;
