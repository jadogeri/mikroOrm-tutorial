/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Forbidden error class for handling HTTP 403 Forbidden errors
 * 
 */
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class ForbiddenError extends ApiError {
  constructor(message: string = ERROR_NAMES.FORBIDDEN.toUpperCase()) {
    super(STATUS_CODES.FORBIDDEN, message, ERROR_NAMES.FORBIDDEN);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
