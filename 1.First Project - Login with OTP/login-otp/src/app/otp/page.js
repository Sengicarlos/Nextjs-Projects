"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function OtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("Enter your 6-digit verification code.");
  const [method, setMethod] = useState("");
  const [contact, setContact] = useState("");
  const [appName, setAppName] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(true);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // ✅ Read query params on mount
  useEffect(() => {
    const m = searchParams.get("method");
    const c = searchParams.get("contact");
    const t = searchParams.get("tempToken");
    const app = searchParams.get("app");

    setMethod(m || "");
    setContact(c || "");
    setTempToken(t || "");
    setAppName(app || "");

    // Dynamic message
    if (m === "email" && c) {
      setMessage(`A 6-digit code has been sent to your email: ${c}`);
    } else if (m === "sms" && c) {
      setMessage(`A 6-digit code has been sent to your phone number: ${c}`);
    } else if (m === "app" && app) {
      setMessage(`Open your ${app} authenticator app to get the 6-digit code.`);
    } else {
      setMessage("Enter your 6-digit verification code.");
    }
  }, [searchParams]);

  // ✅ Countdown timer
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, timerActive]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!tempToken) return alert("Missing temporary token.");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, tempToken }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "OTP verification failed");

      localStorage.setItem("token", data.token);
      alert("OTP verified successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!tempToken) return alert("Missing temporary token.");
    setTimeLeft(180);
    setTimerActive(true);
    setOtp("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to resend OTP");

      setMessage(data.message || message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while resending OTP.");
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-sm shadow-lg bg-white">
        <CardHeader className="mb-4">
          <CardTitle>Enter OTP</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {message && <p className="text-gray-700 text-sm text-center">{message}</p>}

          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              className="text-center text-lg tracking-widest"
              disabled={!timerActive}
            />

            <p className="text-sm text-gray-500 text-center">
              {timerActive ? `Time remaining: ${formatTime(timeLeft)}` : "OTP expired"}
            </p>

            {!timerActive && (
              <Button type="button" onClick={handleResend} className="w-full">
                Resend OTP
              </Button>
            )}

            <CardFooter className="mt-2">
              <Button type="submit" className="w-full" disabled={!timerActive}>
                Verify OTP
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
