
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class BadRequestError extends ApiError {
  constructor(message: string = ERROR_NAMES.BAD_REQUEST.toUpperCase()) {
    super(STATUS_CODES.BAD_REQUEST, message, ERROR_NAMES.BAD_REQUEST);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
