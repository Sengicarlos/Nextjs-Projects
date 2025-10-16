"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        alert("Unexpected server response. Check backend.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ If 2FA is enabled → go to OTP page
      if (data.twoFA?.enabled) {
        const { method, email: twoFAEmail, phone, app } = data.twoFA;
        const contact = method === "email" ? twoFAEmail : phone || "";
        const query = new URLSearchParams({
          tempToken: data.tempToken,
          method,
          contact,
          app: app || "",
        }).toString();

        router.push(`/otp?${query}`);
      } else {
        alert("✅ Login successful!");
        router.push("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Unable to connect to the server. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm bg-white shadow-lg">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </div>
            <CardAction>
              <Link href="/signup">
                <Button variant="link" size="sm">
                  Sign Up
                </Button>
              </Link>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm text-blue-600 underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <CardFooter className="flex flex-col gap-2 mt-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
