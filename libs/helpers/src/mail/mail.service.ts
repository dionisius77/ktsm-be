import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as client from "@sendgrid/mail";

client.setApiKey(
  "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",
);
@Injectable()
export class MailService {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  async sendUserResetPasswordMail(email: string, token: string) {
    const domain = this.config.get<string>("MAIL_URL");
    const url = `${domain}/forgot-password?token=${token}`;

    try {
      await client.send({
        templateId: "d-5a0049365b7b464487b4f07f0d47b139",
        from: "tech@jesselton.capital",
        to: email,
        dynamicTemplateData: {
          link: url,
        },
      });
    } catch (error) {
      return new Error(error);
    }
  }

  async sendWelcomeEmail(email: string, customerName: string) {
    const from = this.config.get<string>("SENDGRID_MAILER_ADDRESS");
    const templateId = this.config.get<string>("SENDGRID_TEMPLATE_WELCOME");
    const data = {
      to: email,
      from: from,
      subject: "Welcome to Picardata",
      templateId: templateId,
      dynamicTemplateData: {
        user_name: customerName,
      },
    };

    return await client.send(data);
  }

  async sendVerifyOtpEmail(email: string, otp: string) {
    const from = this.config.get<string>("SENDGRID_MAILER_ADDRESS");
    const templateId = this.config.get<string>("SENDGRID_TEMPLATE_VERIFYOTP");
    const data = {
      to: email,
      from: from,
      subject: "Picardata Verification Code",
      templateId: templateId,
      dynamicTemplateData: {
        otp_code: otp,
      },
    };

    return await client.send(data);
  }

  async sendResetPasswordOtpEmail(email: string, otp: string) {
    const from = this.config.get<string>("SENDGRID_MAILER_ADDRESS");
    const templateId = this.config.get<string>("SENDGRID_TEMPLATE_RESETOTP");
    const data = {
      to: email,
      from: from,
      subject: "Picardata Reset Password Code",
      templateId: templateId,
      dynamicTemplateData: {
        otp_code: otp,
      },
    };

    return await client.send(data);
  }

  async sendCollaborationInviteEmail(
    email: string,
    ownerName: string,
    companyName: string,
  ) {
    const from = this.config.get<string>("SENDGRID_MAILER_ADDRESS");
    const templateId = this.config.get<string>(
      "SENDGRID_TEMPLATE_COLLABORATION",
    );
    const data = {
      to: email,
      from: from,
      subject: "Picardata Collaboration Invite",
      templateId: templateId,
      dynamicTemplateData: {
        email_name: email.split("@")[0],
        owner_name: ownerName,
        company_name: companyName,
      },
    };

    return await client.send(data);
  }
}
