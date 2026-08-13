export type ApiErrorDetails = Record<string, unknown> | unknown[] | undefined;

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: ApiErrorDetails;

  constructor(statusCode: number, message: string, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request", details?: ApiErrorDetails): ApiError {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "Unauthorized", details?: ApiErrorDetails): ApiError {
    return new ApiError(401, message, details);
  }

  static forbidden(message = "Forbidden", details?: ApiErrorDetails): ApiError {
    return new ApiError(403, message, details);
  }

  static notFound(message = "Resource not found", details?: ApiErrorDetails): ApiError {
    return new ApiError(404, message, details);
  }

  static conflict(message = "Conflict", details?: ApiErrorDetails): ApiError {
    return new ApiError(409, message, details);
  }

  static tooManyRequests(message = "Too many requests", details?: ApiErrorDetails): ApiError {
    return new ApiError(429, message, details);
  }

  static badGateway(message = "Bad gateway", details?: ApiErrorDetails): ApiError {
    return new ApiError(502, message, details);
  }

  static unprocessableEntity(message = "Unprocessable entity", details?: ApiErrorDetails): ApiError {
    return new ApiError(422, message, details);
  }

  static internal(message = "Internal server error", details?: ApiErrorDetails): ApiError {
    return new ApiError(500, message, details);
  }
}
