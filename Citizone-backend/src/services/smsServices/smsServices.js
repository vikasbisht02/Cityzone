import twilio from "twilio";

/**
 * Twilio client
 */
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS
 * @param {string} mobileNumber
 * @param {string} otp
 */
export const sendOTPBySMS = async (mobileNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your Citizone OTP is ${otp}. It is valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobileNumber}`, // India country code
    });

    return { success: true };
  } catch (error) {
    console.error("SMS sending failed:", error);
    return { success: false, error };
  }
};
