import CustomError from "./custom";
import { ValidationError } from "class-validator";

export default class RequestValidationError extends CustomError {
  readonly statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super("Invalid parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): {
    message: string;
    field?: string;
  }[] {
    const validationErrors: { message: string; field: string }[] = [];
    this.errors.map((error) => {
      Object.keys(error.constraints!).map((err) => {
        validationErrors.push({
          message: error.constraints ? error.constraints[err] : "invalid param",
          field: error.property,
        });
      });
    });
    return validationErrors;
  }
}
