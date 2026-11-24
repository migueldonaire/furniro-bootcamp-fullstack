import { Injectable, Logger } from "@nestjs/common";
import { EmailContent, resetPasswordTemplate, verifyEmailTemplate } from "./mail.templates";

// Sends emails with Brevo (https://www.brevo.com), through its HTTP API.
// Why not SMTP with Gmail? Render (free plan) blocks the SMTP ports.
// Without BREVO_API_KEY (local, tests) the email is NOT sent: it is printed
// in the console, so you can copy the link and keep working.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendVerifyEmail(to: string, name: string, link: string) {
    await this.send(to, verifyEmailTemplate(name, link));
  }

  async sendResetPassword(to: string, name: string, link: string) {
    await this.send(to, resetPasswordTemplate(name, link));
  }

  private async send(to: string, email: EmailContent) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      this.logger.log(`[email not sent] To: ${to} | ${email.subject}`);
      this.logger.log(email.html);
      return;
    }

    // Docs: https://developers.brevo.com/reference/sendtransacemail
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json" },
      body: JSON.stringify({
        sender: { name: "Furniro", email: process.env.MAIL_FROM },
        to: [{ email: to }],
        subject: email.subject,
        htmlContent: email.html,
      }),
    });

    if (!response.ok) {
      // We log the details, but never show them to the user
      this.logger.error(`Brevo ${response.status}: ${await response.text()}`);
      throw new Error("The email could not be sent");
    }
  }
}
