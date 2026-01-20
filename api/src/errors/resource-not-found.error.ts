
import { ERROR_NAMES } from "../constants/error-names.constants";
import { STATUS_CODES } from "../constants/status-codes.constants";
import { ApiError } from "./api.error";

export class ResourceNotFoundError extends ApiError {
  constructor(message: string = ERROR_NAMES.RESOURCE_NOT_FOUND.toUpperCase()) {
    super(STATUS_CODES.RESOURCE_NOT_FOUND, message, ERROR_NAMES.RESOURCE_NOT_FOUND);

  Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}
