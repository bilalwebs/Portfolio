import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * 404 handler — must be registered after all routes.
 * Turns any unmatched route into a structured 404 error.
 */
export const notFoundHandler: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Global error-handling middleware — must be the last middleware registered.
 * Normalizes every error into a consistent JSON response:
 *   { success: false, message, error: { name, details? } }
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = normalizeError(err);

  if (error.statusCode >= 500) {
    console.error("[error]", error);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    error: {
      name: error.name,
      ...(error.details !== undefined ? { details: error.details } : {}),
    },
  });
};

const normalizeError = (err: unknown): { statusCode: number; message: string; name: string; details?: unknown } => {
  if (err instanceof ApiError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
      name: err.name,
      details: err.details,
    };
  }

  if (err instanceof SyntaxError && "status" in err) {
    return {
      statusCode: 400,
      message: "Malformed request payload",
      name: "SyntaxError",
    };
  }

  // body-parser raises PayloadTooLargeError (status 413) when the request
  // body exceeds the express.json() limit. Surface it as a clean 413 instead
  // of a generic 500.
  if (err instanceof Error && "status" in err && (err as Error & { status?: number }).status === 413) {
    return {
      statusCode: 413,
      message: "Request payload too large.",
      name: err.name,
    };
  }

  if (err instanceof Error) {
    return {
      statusCode: 500,
      message: "Internal server error",
      name: err.name,
    };
  }

  return {
    statusCode: 500,
    message: "Internal server error",
    name: "UnknownError",
  };
};
