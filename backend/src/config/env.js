const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change_this_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES || 10),
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    fromPhone: process.env.TWILIO_FROM_PHONE || "",
    useMock: String(process.env.TWILIO_USE_MOCK || "true") === "true",
  },
};

module.exports = env;
