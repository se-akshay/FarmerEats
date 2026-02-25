const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "farmer" },
    business_name: { type: String, required: true, trim: true },
    informal_name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip_code: { type: Number, required: true },
    registration_proof: { type: String, required: true, trim: true },
    business_hours: { type: mongoose.Schema.Types.Mixed, required: true },
    device_token: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    social_id: { type: String, required: true, trim: true },
    is_verified: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
