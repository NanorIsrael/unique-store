import { IsNotEmpty, IsString } from "class-validator";
import { IProductLine } from "../product-line/product.line.schema";
import { Types } from "mongoose";

class OrderDto {
  @IsString()
  @IsNotEmpty()
  readonly productLine: Partial<IProductLine>[];

  @IsNotEmpty()
  readonly userId: Types.ObjectId;

  constructor(productLine: Partial<IProductLine>[], userId: Types.ObjectId) {
    this.productLine = productLine;
    this.userId = userId;
  }
}
export default OrderDto;
