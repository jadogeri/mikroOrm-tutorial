
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class ConflictError extends ApiError {
  constructor(message: string = ERROR_NAMES.CONFLICT.toUpperCase()) {
    super(STATUS_CODES.CONFLICT, message, ERROR_NAMES.CONFLICT);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
