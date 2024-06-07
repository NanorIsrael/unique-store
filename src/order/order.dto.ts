import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { IProductLine } from "../product-line/product.line.schema";

class OrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productLine: IProductLine[];

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  constructor(productLine: IProductLine[], userId: string) {
    this.productLine = productLine;
    this.userId = userId;
  }
}
export default OrderDto;
