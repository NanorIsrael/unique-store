import CustomError from "./custom";

export default class NotFoundError extends CustomError {
  readonly statusCode = 404;

  constructor() {
    super("not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
