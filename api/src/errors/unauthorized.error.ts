/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Unauthorized error class for handling HTTP 401 Unauthorized errors
 * 
 */
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class UnAuthorizedError extends ApiError {
  constructor(message: string = ERROR_NAMES.UNAUTHORIZED.toUpperCase()) {
    super(STATUS_CODES.UNAUTHORIZED, message, ERROR_NAMES.UNAUTHORIZED);

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }
}
