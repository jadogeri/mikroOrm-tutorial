/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description HTTP error class for handling generic HTTP errors
 * 
 */
export class HttpError extends Error {

  public readonly statusCode : number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Set the prototype explicitly to make sure it works with `instanceof`
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
