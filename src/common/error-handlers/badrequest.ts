import CustomError from "./custom";

export default class BadRequestError extends CustomError {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
