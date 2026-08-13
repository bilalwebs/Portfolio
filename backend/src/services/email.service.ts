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

const EMAIL_COLORS = {
  primary: "#06B6D4",
  primaryDark: "#0E7490",
  tint: "#ECFEFF",
  tintBorder: "#CFFAFE",
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
};

const formatSubmissionTime = (): string => {
  const value = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date());
  return `${value} UTC`;
};

const buildHtmlBody = (payload: ContactNotificationPayload): string => {
  const subject = payload.subject ?? "(no subject)";
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>New Portfolio Contact</title>
  </head>
  <body style="margin:0;padding:0;background-color:${EMAIL_COLORS.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${EMAIL_COLORS.text};">
    <div style="display:none;max-height:0;max-width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${EMAIL_COLORS.background};">A new message has been submitted through Muhammad Bilal Hussain's portfolio website.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.background};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:16px;box-shadow:0 2px 12px rgba(15,23,42,0.05);">
            <tr>
              <td style="background-color:${EMAIL_COLORS.primary};background-image:linear-gradient(135deg,${EMAIL_COLORS.primaryDark} 0%,${EMAIL_COLORS.primary} 100%);border-radius:16px 16px 0 0;padding:36px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="76" valign="middle">
                      <table role="presentation" width="56" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="56" height="56" align="center" valign="middle" style="width:56px;height:56px;background-color:${EMAIL_COLORS.card};border-radius:16px;font-size:18px;font-weight:700;letter-spacing:1px;color:${EMAIL_COLORS.primaryDark};">MBH</td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left:20px;">
                      <p style="margin:0;color:${EMAIL_COLORS.card};font-size:20px;font-weight:700;letter-spacing:-0.3px;line-height:1.25;">Muhammad Bilal Hussain</p>
                      <p style="margin:6px 0 0;color:#E0F7FA;font-size:13.5px;font-weight:500;letter-spacing:0.2px;line-height:1.5;">AI Engineer | Full-Stack Engineer</p>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
                        <tr>
                          <td align="center" style="background-color:#0FA8C2;border:1px solid #8DE7F5;border-radius:999px;padding:5px 14px;font-size:10.5px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:#E0F7FA;">Portfolio Contact Notification</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 44px;">
                <p style="margin:0 0 10px;font-size:26px;font-weight:700;letter-spacing:-0.4px;color:${EMAIL_COLORS.text};line-height:1.25;">📩 New Portfolio Contact</p>
                <p style="margin:0 0 32px;font-size:15px;line-height:1.65;color:${EMAIL_COLORS.muted};">A new message has been submitted through your portfolio website.</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${EMAIL_COLORS.border};border-radius:14px;">
                  <tr>
                    <td style="padding:0 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="120" style="padding:20px 0;font-size:13px;letter-spacing:0.2px;color:${EMAIL_COLORS.muted};">👤 Name</td>
                          <td style="padding:20px 0;font-size:15px;font-weight:600;color:${EMAIL_COLORS.text};">${escapeHtml(payload.visitorName)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 24px;border-top:1px solid ${EMAIL_COLORS.border};">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="120" style="padding:20px 0;font-size:13px;letter-spacing:0.2px;color:${EMAIL_COLORS.muted};">📧 Email</td>
                          <td style="padding:20px 0;font-size:15px;font-weight:600;color:${EMAIL_COLORS.text};">${escapeHtml(payload.visitorEmail)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 24px;border-top:1px solid ${EMAIL_COLORS.border};">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="120" style="padding:20px 0;font-size:13px;letter-spacing:0.2px;color:${EMAIL_COLORS.muted};">📝 Subject</td>
                          <td style="padding:20px 0;font-size:15px;font-weight:600;color:${EMAIL_COLORS.text};">${escapeHtml(subject)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:36px 0 12px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${EMAIL_COLORS.muted};">Message</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.tint};border:1px solid ${EMAIL_COLORS.tintBorder};border-left:4px solid ${EMAIL_COLORS.primary};border-radius:14px;">
                  <tr>
                    <td style="padding:24px;font-size:15px;line-height:1.75;color:${EMAIL_COLORS.text};white-space:pre-wrap;word-break:break-word;">${escapeHtml(payload.message)}</td>
                  </tr>
                </table>

                <p style="margin:36px 0 12px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${EMAIL_COLORS.muted};">Submission Details</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.background};border:1px solid ${EMAIL_COLORS.border};border-radius:14px;">
                  <tr>
                    <td style="padding:6px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="150" style="padding:16px 0;font-size:13px;color:${EMAIL_COLORS.muted};">Reference ID</td>
                          <td style="padding:16px 0;font-size:13px;font-weight:600;color:${EMAIL_COLORS.text};">${escapeHtml(payload.trackingId)}</td>
                        </tr>
                        <tr>
                          <td style="padding:16px 0;border-top:1px solid ${EMAIL_COLORS.border};font-size:13px;color:${EMAIL_COLORS.muted};">Submission Time</td>
                          <td style="padding:16px 0;border-top:1px solid ${EMAIL_COLORS.border};font-size:13px;font-weight:600;color:${EMAIL_COLORS.text};">${formatSubmissionTime()}</td>
                        </tr>
                        <tr>
                          <td style="padding:16px 0;border-top:1px solid ${EMAIL_COLORS.border};font-size:13px;color:${EMAIL_COLORS.muted};">Source</td>
                          <td style="padding:16px 0;border-top:1px solid ${EMAIL_COLORS.border};font-size:13px;font-weight:600;color:${EMAIL_COLORS.text};">Portfolio Contact Form</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:36px 0 0;">
                  <tr>
                    <td align="center">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" bgcolor="${EMAIL_COLORS.primary}" style="border-radius:999px;background-color:${EMAIL_COLORS.primary};">
                            <a href="mailto:${escapeHtml(payload.visitorEmail)}" style="display:block;padding:16px 42px;font-size:15px;font-weight:600;color:${EMAIL_COLORS.card};text-decoration:none;border-radius:999px;letter-spacing:0.2px;">Reply to Sender</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:40px 0 0;border-top:1px solid ${EMAIL_COLORS.border};">
                  <tr>
                    <td style="padding:28px 0 0;font-size:12px;line-height:1.8;color:${EMAIL_COLORS.muted};text-align:center;">
                      <p style="margin:0;">This email was automatically generated by</p>
                      <p style="margin:2px 0 0;font-weight:600;color:#374151;">Muhammad Bilal Hussain's Portfolio.</p>
                      <p style="margin:14px 0 0;">Please do not reply directly unless responding to the sender.</p>
                      <p style="margin:14px 0 0;">© Muhammad Bilal Hussain</p>
                    </td>
                  </tr>
                </table>
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
