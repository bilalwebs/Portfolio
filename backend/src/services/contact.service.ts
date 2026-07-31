import { prisma } from "../lib/prisma.js";
import { emailService } from "./email.service.js";
import { ApiError } from "../utils/ApiError.js";

export interface ContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactSubmissionResult {
  accepted: boolean;
  trackingId: string;
  provider: string;
}

/**
 * Contact form service layer.
 *
 * 1. Persists every validated submission to PostgreSQL via Prisma.
 * 2. Sends a notification email to the portfolio owner via Resend.
 *
 * The `trackingId` returned in the API response is the stored row's id.
 * If the email fails to send, the submission is still saved, but a
 * proper backend error is raised so the client knows delivery failed.
 */
export const contactService = {
  async submitMessage(input: ContactMessageInput): Promise<ContactSubmissionResult> {
    const submission = await prisma.contactSubmission.create({
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      },
    });

    console.info("[contact.service] message stored", {
      trackingId: submission.id,
      name: submission.name,
    });

    try {
      await emailService.sendContactNotification({
        trackingId: submission.id,
        visitorName: submission.name,
        visitorEmail: submission.email,
        subject: submission.subject ?? undefined,
        message: submission.message,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("[contact.service] unexpected email failure", error);
      throw ApiError.badGateway("The submission was saved, but the notification email could not be sent. Please try again later.");
    }

    return {
      accepted: true,
      trackingId: submission.id,
      provider: "postgres",
    };
  },
};
