import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 p-6">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold mb-6 text-center text-gray-900">
        Welcome to My App
      </h1>

      {/* Description */}
      <p className="text-center mb-8 text-gray-600 max-w-xl">
        Access your account and manage your data easily. Seamlessly login or sign up to start using all features.
      </p>

      {/* Login Button */}
      <Link href="/login">
        <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          Go to Login
        </button>
      </Link>

      {/* Illustration */}
      <div className="mt-12">
        <Image
          src="/login-illustration.png" // Replace with your image path
          alt="Login Illustration"
          width={500}
          height={350}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
