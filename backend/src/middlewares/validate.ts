import type { NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult, type ValidationChain } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/**
 * Runs the supplied express-validator rule chains, then forwards a
 * structured 422 ApiError if any rule failed. Falls back to a 500
 * if an unexpected runtime error is thrown inside a validator.
 */
export const validate = (rules: ValidationChain[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.all(rules.map((rule) => rule.run(req)))
      .then(() => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          next();
          return;
        }
        next(
          ApiError.unprocessableEntity("Validation failed", result.array({ onlyFirstError: true })),
        );
      })
      .catch(next);
  };
};
