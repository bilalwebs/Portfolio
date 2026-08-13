import type { Response } from "express";

export interface ApiSuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message = "Success", statusCode = 200): Response<ApiSuccessBody<T>> {
    return res.status(statusCode).json({ success: true, message, data });
  }
}
