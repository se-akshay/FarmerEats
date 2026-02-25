const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mobile: { type: String, required: true, trim: true },
    otp: { type: String, required: true, trim: true },
    resetToken: { type: String, default: "", trim: true },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date, default: null },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Otp", otpSchema);
