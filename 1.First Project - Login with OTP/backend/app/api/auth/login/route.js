// src/app/api/auth/login/route.js
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmailOTP, sendSMSOTP } from "@/lib/otpSender";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user)
      return Response.json({ message: "Invalid email or password" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return Response.json({ message: "Invalid email or password" }, { status: 401 });

    if (user.twoFA?.enabled) {
      const otp = crypto.randomInt(100000, 999999).toString();
      user.twoFA.otp = otp;
      user.twoFA.otpExpires = Date.now() + 3 * 60 * 1000;
      await user.save();

      if (user.twoFA.method === "email") {
        await sendEmailOTP(user.twoFA.email || user.email, otp);
      } else if (user.twoFA.method === "sms") {
        await sendSMSOTP(`${user.twoFA.countryCode || ""}${user.twoFA.phone}`, otp);
      }

      const tempToken = jwt.sign({ id: user._id, twoFA: true }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });

      return Response.json({
        message: "2FA enabled, OTP required",
        tempToken,
        twoFA: {
          enabled: true,
          method: user.twoFA.method,
          email: user.twoFA.email || user.email,
          phone: user.twoFA.phone,
          countryCode: user.twoFA.countryCode,
        },
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return Response.json({
      message: "Login successful",
      token,
      twoFA: { enabled: false },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
