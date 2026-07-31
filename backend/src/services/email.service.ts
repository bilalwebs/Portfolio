import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export interface ContactNotificationPayload {
  trackingId: string;
  visitorName: string;
  visitorEmail: string;
  subject?: string;
  message: string;
}

const transport: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000,
});

/**
 * Email delivery service.
 *
 * Sends a contact-form notification to the portfolio owner's inbox via
 * Gmail SMTP (Nodemailer). The visitor's email is set as the Reply-To so
 * the owner can respond directly to the sender.
 */
export const emailService = {
  async sendContactNotification(payload: ContactNotificationPayload): Promise<{ emailId: string }> {
    try {
      const info = await transport.sendMail({
        from: `"Bilal Portfolio" <${env.GMAIL_USER}>`,
        to: [env.CONTACT_EMAIL],
        replyTo: [payload.visitorEmail],
        subject: `New portfolio contact from ${payload.visitorName}`,
        text: buildTextBody(payload),
        html: buildHtmlBody(payload),
      });

      console.info("[email.service] notification email sent", {
        messageId: info.messageId,
        trackingId: payload.trackingId,
      });

      return { emailId: info.messageId };
    } catch (error) {
      console.error("[email.service] failed to send notification email", {
        trackingId: payload.trackingId,
        error: error instanceof Error ? error.message : error,
      });
      throw ApiError.badGateway(
        "The submission was saved, but the notification email could not be sent. Please try again later.",
      );
    }
  },
};

const buildTextBody = (payload: ContactNotificationPayload): string => {
  return [
    `You received a new contact form submission.`,
    ``,
    `Name:    ${payload.visitorName}`,
    `Email:   ${payload.visitorEmail}`,
    `Subject: ${payload.subject ?? "(no subject)"}`,
    ``,
    `Message:`,
    payload.message,
    ``,
    `Reference: ${payload.trackingId}`,
  ].join("\n");
};

const buildHtmlBody = (payload: ContactNotificationPayload): string => {
  const subject = payload.subject ?? "(no subject)";
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
            <tr>
              <td style="background-color:#0e7490;padding:20px 28px;">
                <p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">New Portfolio Contact</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(payload.visitorName)}</p>
                <p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(payload.visitorEmail)}</p>
                <p style="margin:0 0 16px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <p style="margin:0 0 8px;"><strong>Message:</strong></p>
                <p style="margin:0 0 16px;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
                <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;" />
                <p style="margin:0;color:#71717a;font-size:12px;">Reference: ${escapeHtml(payload.trackingId)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
