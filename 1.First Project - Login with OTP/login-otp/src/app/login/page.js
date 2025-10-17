"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
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
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Unable to connect to the server. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
      <Card className="w-full max-w-sm bg-green-100 shadow-lg rounded-xl border border-green-200">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-900">Login to your account</CardTitle>
              <CardDescription className="text-green-800">
                Enter your email and password to access your account
              </CardDescription>
            </div>
            <CardAction>
              <Link href="/signup">
                <Button variant="link" size="sm" className="text-green-700">
                  Sign Up
                </Button>
              </Link>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-green-900">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-300"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-green-900">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-green-700 text-sm underline-offset-4 hover:underline"
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
                className="border-green-300 focus:border-green-500 focus:ring-green-300"
              />
            </div>

            <CardFooter className="flex flex-col gap-2 mt-2">
              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Button
                variant="outline"
                className="w-full border-green-700 text-green-700 hover:bg-green-200"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
