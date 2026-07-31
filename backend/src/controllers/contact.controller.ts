import type { Request, Response } from "express";
import { contactService, type ContactMessageInput } from "../services/contact.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const contactController = {
  /**
   * POST /api/contact — accept a contact form submission.
   * Validation is performed by the contactRoutes middleware chain;
   * this handler only invokes the service layer and responds.
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const input: ContactMessageInput = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    };

    const result = await contactService.submitMessage(input);

    return ApiResponse.success(res, result, "Message received", 202);
  }),
};
