import CustomError from "./custom";

export default class DatabaseConnectionError extends CustomError {
  readonly statusCode = 500;
  readonly reason = "database connection error";

  constructor() {
    super("database connection error");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.reason }];
  }
}
