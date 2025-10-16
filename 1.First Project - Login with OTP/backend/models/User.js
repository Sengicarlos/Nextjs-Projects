import mongoose from "mongoose";

/**
 * Schema for Two-Factor Authentication
 */
const TwoFASchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  method: { type: String, enum: ["email", "sms", "app"], default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  countryCode: { type: String, default: null },
  app: { type: String, default: null },
});

/**
 * Main User Schema
 */
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], default: null },
    age: { type: Date, required: true },
    twoFA: { type: TwoFASchema, default: () => ({}) },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
