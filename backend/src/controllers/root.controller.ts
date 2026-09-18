import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const rootController = {
  /**
   * GET / — Welcome endpoint returning API status and project details.
   */
  welcome: asyncHandler(async (_req: Request, res: Response) => {
    return ApiResponse.success(
      res,
      {
        status: "online",
        developer: {
          name: "Muhammad Bilal Hussain",
          role: "AI Engineer & Full-Stack Engineer",
          location: "Karachi, Pakistan",
        },
        project: {
          name: "Bilal Portfolio API",
          description: "Backend API powering the AI-driven portfolio website with intelligent chat, contact form, and portfolio data.",
          version: "1.0.0",
        },
        endpoints: {
          health: "/health",
          chat: "/api/chat",
          contact: "/api/contact",
        },
        timestamp: new Date().toISOString(),
      },
      "Portfolio API is running",
    );
  }),
};
