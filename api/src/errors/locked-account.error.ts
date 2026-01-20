
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class LockedAccountError extends ApiError {
  constructor(message: string = ERROR_NAMES.LOCKED_ACCOUNT.toUpperCase()) {
    super(STATUS_CODES.LOCKED_ACCOUNT, message, ERROR_NAMES.LOCKED_ACCOUNT);

    Object.setPrototypeOf(this, LockedAccountError.prototype);
    Object.setPrototypeOf(this, LockedAccountError.prototype);
  }
}
