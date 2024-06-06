import CustomError from "./custom";

export default class NotAuthorisedError extends CustomError {
  readonly statusCode = 401;

  constructor() {
    super("not authorised");
    Object.setPrototypeOf(this, NotAuthorisedError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
