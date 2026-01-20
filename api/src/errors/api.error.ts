
export class ApiError extends Error {

  public readonly statusCode: number;
  public readonly title: string;

  constructor(statusCode: number, message: string, title: string = 'Error') {
    super(message);
    this.statusCode = statusCode;
    this.title = title;
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

