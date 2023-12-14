import _ from "lodash";

import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const config = new ConfigService();
const RecaptchaUtil = {
  createAssessment: async ({ action, token, userAgent, userIpAddress }) => {
    const isOtp = token.startsWith("otp-");
    const mobileKey = config.get<string>("MOBILE_KEY");

    if (isOtp) {
      if (!_.isEqual(mobileKey, _.replace(token, "otp-", ""))) {
        throw new HttpException(`OTP validation failed.`, HttpStatus.FORBIDDEN);
      }
    } else if (
      !["development", "test", "production"].includes(process.env.NODE_ENV)
    ) {
      const projectID = config.get<string>("GOOGLE_RECAPTCHA_PROJECT_ID");
      const recaptchaSiteKey = config.get<string>("GOOGLE_RECAPTCHA_SITE_KEY");

      // let projectID = process.env.GOOGLE_RECAPTCHA_PROJECT_ID;
      // let recaptchaSiteKey = process.env.GOOGLE_RECAPTCHA_SITE_KEY;

      // Create the reCAPTCHA client.
      const client = new RecaptchaEnterpriseServiceClient();

      // Set the properties of the event to be tracked.
      const event = {
        token: token,
        siteKey: recaptchaSiteKey,
        userAgent,
        userIpAddress,
        expectedAction: action,
      };

      const assessment = {
        event: event,
      };

      const projectPath = client.projectPath(projectID);

      // Build the assessment request.
      const request = {
        assessment: assessment,
        parent: projectPath,
      };

      try {
        const response = await client.createAssessment(request);
        const assessment = response[0];

        if (!assessment.tokenProperties.valid) {
          console.error(
            "RecaptchaUtil",
            "createAssessment",
            "The CreateAssessment call failed because the token was: " +
              assessment.tokenProperties.invalidReason,
          );
          throw new HttpException(
            `Recaptcha validation failed.`,
            HttpStatus.BAD_REQUEST,
          );
        } else {
          // Check if the expected action was executed.
          if (assessment.tokenProperties.action === action) {
            // Get the risk score and the reason(s).
            // For more information on interpreting the assessment,
            // see: https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
            const score = assessment.riskAnalysis.score;

            if (score < 0.5) {
              // List classification reasons.
              assessment.riskAnalysis.reasons.forEach(function (reason) {
                console.info("RecaptchaUtil", "createAssessment", reason);
              });

              throw new HttpException(
                `Recaptcha validation failed.`,
                HttpStatus.FORBIDDEN,
              );
            }
          } else {
            throw new HttpException(
              `The action attribute in your reCAPTCHA tag.`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      } catch (e) {
        console.error("RecaptchaUtil", "createAssessment", "error", e);
        throw new HttpException(
          `Recaptcha unknown error.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  },
};

export default RecaptchaUtil;
