import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const healthController = {
  /**
   * GET /health — liveness/readiness probe.
   */
  check: asyncHandler(async (_req: Request, res: Response) => {
    return ApiResponse.success(
      res,
      {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
      "Service is healthy",
    );
  }),
};
