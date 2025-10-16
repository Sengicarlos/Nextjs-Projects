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
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectItem } from "@/components/ui/select";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);
  const [twoFAOption, setTwoFAOption] = useState("email");
  const [twoFAEmail, setTwoFAEmail] = useState("");
  const [twoFAPhone, setTwoFAPhone] = useState("");
  const [twoFACountry, setTwoFACountry] = useState("+255");
  const [twoFAApp, setTwoFAApp] = useState("Google Authenticator");
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      firstName,
      lastName,
      username,
      email,
      password,
      gender,
      age: age ? new Date(age) : null,
      twoFA: enable2FA
        ? {
            enabled: true,
            method: twoFAOption,
            email: twoFAOption === "email" ? twoFAEmail : undefined,
            phone: twoFAOption === "sms" ? twoFAPhone : undefined,
            countryCode: twoFAOption === "sms" ? twoFACountry : undefined,
            app: twoFAOption === "app" ? twoFAApp : undefined,
          }
        : { enabled: false },
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      setSuccess(true);

      // ✅ Always redirect to login after signup
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 relative">
      <Card className="w-full max-w-lg shadow-lg bg-white">
        <CardHeader className="mb-4">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Fill in your details to start using the app.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            {/* Basic Details */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="john_doe" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectItem value="">Select Gender</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="age">Date of Birth</Label>
                <Input id="age" type="date" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
            </div>

            <hr className="my-4 border-gray-300" />
            <p className="text-sm text-gray-600">Additional Security</p>

            <div className="flex items-center justify-between">
              <p>Enable 2FA (optional)</p>
              <Switch checked={enable2FA} onCheckedChange={setEnable2FA} />
            </div>

            {enable2FA && (
              <div className="grid gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <Label>2FA Method</Label>
                  <Select value={twoFAOption} onValueChange={setTwoFAOption}>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="app">Authenticator App</SelectItem>
                  </Select>
                </div>

                {twoFAOption === "email" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="twoFAEmail">Email for 2FA</Label>
                    <Input id="twoFAEmail" type="email" placeholder="you@example.com" value={twoFAEmail} onChange={(e) => setTwoFAEmail(e.target.value)} />
                  </div>
                )}

                {twoFAOption === "sms" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="twoFAPhone">Phone Number for 2FA</Label>
                    <div className="flex gap-2">
                      <Input id="twoFACountry" placeholder="+255" value={twoFACountry} onChange={(e) => setTwoFACountry(e.target.value)} className="w-24" />
                      <Input id="twoFAPhone" placeholder="712345678" value={twoFAPhone} onChange={(e) => setTwoFAPhone(e.target.value)} className="flex-1" />
                    </div>
                  </div>
                )}

                {twoFAOption === "app" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="twoFAApp">Choose App</Label>
                    <Select value={twoFAApp} onValueChange={setTwoFAApp}>
                      <SelectItem value="Google Authenticator">Google Authenticator</SelectItem>
                      <SelectItem value="Authy">Authy</SelectItem>
                      <SelectItem value="Microsoft Authenticator">Microsoft Authenticator</SelectItem>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <CardFooter className="mt-4 flex flex-col gap-2">
              <Button type="submit" className="w-full">Sign Up</Button>
              <Link href="/login" className="text-center text-sm text-blue-600 hover:underline">
                Already have an account? Login
              </Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-24 h-24 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            <p className="text-green-600 font-semibold text-lg">Account Created Successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}
