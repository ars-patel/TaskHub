import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Member"],
      default: "Admin",
    },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    twoFAOtp: { type: String, select: false },
    twoFAOtpExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, role: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;
