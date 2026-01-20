
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class InternalServerError extends ApiError {
  constructor(message: string = ERROR_NAMES.SERVER_ERROR.toUpperCase()) {
    super(STATUS_CODES.SERVER_ERROR, message, ERROR_NAMES.SERVER_ERROR);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
