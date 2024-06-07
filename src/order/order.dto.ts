import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

class OrderDto {
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
export default OrderDto;
