
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class ForbiddenError extends ApiError {
  constructor(message: string = ERROR_NAMES.FORBIDDEN.toUpperCase()) {
    super(STATUS_CODES.FORBIDDEN, message, ERROR_NAMES.FORBIDDEN);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
