// src/app/api/auth/signup/route.js
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB(); // connect to MongoDB

    const body = await req.json();
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      gender,
      age,
      twoFA,
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User already exists" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      gender,
      age: age ? new Date(age) : null,
      twoFA: twoFA?.enabled
        ? {
            enabled: true,
            method: twoFA.method || "email",
            email: twoFA.email || "",
            phone: twoFA.phone || "",
            countryCode: twoFA.countryCode || "",
            app: twoFA.app || "",
          }
        : { enabled: false },
    };

    // Create and save user
    const user = new User(userData);
    await user.save();

    return new Response(
      JSON.stringify({ message: "User created successfully", userId: user._id }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
