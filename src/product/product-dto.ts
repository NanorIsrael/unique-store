import { IsNotEmpty, IsNumber, IsString } from "class-validator";

class ProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly stock: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  constructor(name: string, stock: number, price: number) {
    this.name = name;
    this.stock = stock;
    this.price = price;
  }
}
export default ProductDto;
