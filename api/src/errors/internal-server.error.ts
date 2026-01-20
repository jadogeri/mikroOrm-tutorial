/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Internal Server error class for handling HTTP 500 Internal Server errors
 * 
 */
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class InternalServerError extends ApiError {
  constructor(message: string = ERROR_NAMES.SERVER_ERROR.toUpperCase()) {
    super(STATUS_CODES.SERVER_ERROR, message, ERROR_NAMES.SERVER_ERROR);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
