const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const env = require("../config/env");
const { signAccessToken } = require("../utils/token");
const { sendOtpSms } = require("../services/twilioService");

const ALLOWED_TYPES = ["email", "facebook", "google", "apple"];

function ok(res, payload) {
  return res.status(200).json(payload);
}

function normalizePhone(phone) {
  return String(phone || "").trim();
}

function generateOtp(length = 5) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

async function register(req, res) {
  try {
    const body = req.body || {};

    if (String(body.role || "").trim() !== "farmer") {
      return res
        .status(401)
        .json({ success: false, message: "access denied! unauthorized user." });
    }

    if (!String(body.device_token || "").trim()) {
      return ok(res, { success: false, message: "invalid token." });
    }

    if (!String(body.social_id || "").trim()) {
      return ok(res, { success: false, message: "social id required." });
    }

    const requiredFields = [
      "full_name",
      "email",
      "phone",
      "password",
      "business_name",
      "informal_name",
      "address",
      "city",
      "state",
      "zip_code",
      "registration_proof",
      "business_hours",
      "type",
    ];

    const hasMissingField = requiredFields.some((field) => {
      const value = body[field];
      if (field === "business_hours") {
        return !value || typeof value !== "object";
      }
      return (
        value === undefined || value === null || String(value).trim() === ""
      );
    });

    if (hasMissingField) {
      return ok(res, { success: false, message: "All fields are required." });
    }

    const normalizedEmail = String(body.email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return ok(res, { success: false, message: "Email already exists." });
    }

    if (!ALLOWED_TYPES.includes(String(body.type).trim())) {
      return ok(res, { success: false, message: "registration failed." });
    }

    const hashedPassword = await bcrypt.hash(String(body.password), 10);

    const user = await User.create({
      full_name: String(body.full_name).trim(),
      email: normalizedEmail,
      phone: normalizePhone(body.phone),
      password: hashedPassword,
      role: "farmer",
      business_name: String(body.business_name).trim(),
      informal_name: String(body.informal_name).trim(),
      address: String(body.address).trim(),
      city: String(body.city).trim(),
      state: String(body.state).trim(),
      zip_code: Number(body.zip_code),
      registration_proof: String(body.registration_proof).trim(),
      business_hours: body.business_hours,
      device_token: String(body.device_token).trim(),
      type: String(body.type).trim(),
      social_id: String(body.social_id).trim(),
      is_verified: true,
    });

    if (!user?._id) {
      return ok(res, { success: false, message: "registration failed." });
    }

    const token = signAccessToken({ id: String(user._id), email: user.email });
    return ok(res, { success: true, message: "Registered.", token });
  } catch (error) {
    return ok(res, {
      success: false,
      message: "server error while registering.",
    });
  }
}

async function login(req, res) {
  try {
    const body = req.body || {};

    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const role = String(body.role || "").trim();
    const type = String(body.type || "").trim();
    const socialId = String(body.social_id || "").trim();

    if (!email) {
      return ok(res, { success: false, message: "Email cannot be empty." });
    }

    if (!password) {
      return ok(res, { success: false, message: "Password cannot be empty." });
    }

    if (role !== "farmer") {
      return ok(res, { success: false, message: "Role not matched." });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return ok(res, { success: false, message: "Type not matched." });
    }

    if (!socialId) {
      return ok(res, { success: false, message: "Social id cannot be empty." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return ok(res, { success: false, message: "Account does not exist." });
    }

    if (String(user.type || "") !== type) {
      return ok(res, { success: false, message: "Type not matched." });
    }

    if (String(user.social_id || "") !== socialId) {
      return ok(res, { success: false, message: "Social id not matched." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    if (!user.is_verified) {
      return ok(res, {
        success: false,
        message: "Account is not verified, please contact administrator.",
      });
    }

    const token = signAccessToken({ id: String(user._id), email: user.email });

    return ok(res, {
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: String(user._id),
        full_name: user.full_name,
        email: user.email,
        device_token: user.device_token,
        type: user.type,
        social_id: user.social_id,
      },
      is_verified: user.is_verified,
    });
  } catch (error) {
    return ok(res, { success: false, message: "server error while login." });
  }
}

async function forgotPassword(req, res) {
  try {
    const body = req.body || {};
    const mobile = normalizePhone(body.mobile);

    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return ok(res, {
        success: false,
        message: "Account with this mobile number does not exist.",
      });
    }

    const otpCode = generateOtp(5);
    const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

    await Otp.create({
      userId: user._id,
      mobile,
      otp: otpCode,
      resetToken: otpCode,
      expiresAt,
    });

    try {
      await sendOtpSms(mobile, otpCode);
    } catch (error) {
      return ok(res, {
        success: false,
        message: "Couldn't send an OTP, please try again.",
      });
    }

    return ok(res, { success: true, message: "OTP sent to your mobile." });
  } catch (error) {
    return ok(res, {
      success: false,
      message: "Couldn't send an OTP, please try again.",
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const body = req.body || {};
    const otpValue = String(body.otp || "").trim();

    if (!otpValue) {
      return ok(res, { success: false, message: "OTP cannot be empty." });
    }

    const otpRecord = await Otp.findOne({ otp: otpValue, isUsed: false }).sort({
      createdAt: -1,
    });

    if (!otpRecord) {
      return res.status(401).json({ success: false, message: "Invalid OTP." });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return ok(res, {
        success: false,
        message: "Unable to verify OTP, please try again.",
      });
    }

    otpRecord.verifiedAt = new Date();
    otpRecord.resetToken = otpRecord.otp;
    await otpRecord.save();

    return ok(res, {
      success: true,
      message: "OTP verified successful.",
      token: otpRecord.resetToken,
    });
  } catch (error) {
    return ok(res, {
      success: false,
      message: "Unable to verify OTP, please try again.",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const body = req.body || {};
    const token = String(body.token || "").trim();
    const password = String(body.password || "");
    const cpassword = String(body.cpassword || "");

    if (password !== cpassword) {
      return ok(res, {
        success: false,
        message: "Password and confirm password not matched.",
      });
    }

    const otpRecord = await Otp.findOne({
      resetToken: token,
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return ok(res, { success: false, message: "Invalid token." });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return ok(res, {
        success: false,
        message: "Your password reset OTP was expired.",
      });
    }

    const user = await User.findById(otpRecord.userId);
    if (!user) {
      return ok(res, {
        success: false,
        message: "Your password reset request failed, please try again.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.is_verified = true;
    await user.save();

    otpRecord.isUsed = true;
    await otpRecord.save();

    return ok(res, {
      success: true,
      message: "Your password has been successfully changed.",
      is_verified: "true",
    });
  } catch (error) {
    return ok(res, {
      success: false,
      message: "Your password reset request failed, please try again.",
    });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
