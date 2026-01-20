export class HttpError extends Error {

  public readonly statusCode : number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Set the prototype explicitly to make sure it works with `instanceof`
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
