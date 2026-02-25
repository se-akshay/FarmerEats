const twilio = require("twilio");
const env = require("../config/env");

let twilioClient = null;

function getClient() {
  if (twilioClient) return twilioClient;

  if (!env.twilio.accountSid || !env.twilio.authToken) {
    throw new Error("Twilio credentials are not configured.");
  }

  twilioClient = twilio(env.twilio.accountSid, env.twilio.authToken);
  return twilioClient;
}

async function sendOtpSms(toPhone, otp) {
  if (env.twilio.useMock) {
    console.log(`[MOCK TWILIO] OTP for ${toPhone}: ${otp}`);
    return { sid: "mock-twilio-message-sid" };
  }

  if (!env.twilio.fromPhone) {
    throw new Error("TWILIO_FROM_PHONE is missing.");
  }

  const client = getClient();
  return client.messages.create({
    body: `Your FarmerEats OTP is ${otp}`,
    from: env.twilio.fromPhone,
    to: toPhone,
  });
}

module.exports = {
  sendOtpSms,
};
