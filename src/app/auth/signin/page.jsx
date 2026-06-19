"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Link,
  TextField,
  Label,
  InputGroup,
  Input,
} from "@heroui/react";
import { Eye, EyeSlash, At, ShieldKeyhole } from "@gravity-ui/icons";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Email Sign-in Logic
  const handleSignin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: redirectTo,
    });

    if (error) {
      toast.error(error.message || "Invalid credentials.");
      setIsLoading(false);
    } else {
      toast.success("Welcome back!");
      router.push(redirectTo);
    }
  };

  // Google OAuth Logic
  const handleGoogleSignin = async () => {
    setIsGoogleLoading(true);
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });

    if (error) {
      toast.error("Google sign-in failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#1a1a2e] px-4 py-10">
      {/* Gradient Border Wrapper */}
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/50 to-blue-500/50 w-full max-w-md">
        {/* Glassmorphism Card */}
        <Card className="w-full p-6 bg-[#1a1a2e] backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Header with Logo */}
          <div className="flex flex-col items-center justify-center gap-2 pb-6 text-center">
            <img
              src="/logo.png"
              alt="Promptrix"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-zinc-400">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSignin} className="flex flex-col gap-4">
            {/* Google Sign-in Button */}
            <Button
              variant="flat"
              isLoading={isGoogleLoading}
              onClick={handleGoogleSignin}
              className="w-full h-12 rounded-xl font-medium bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center justify-center gap-3"
            >
              {/* Inline White Google SVG */}
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M21.35 11.1h-9.28v2.85h5.36c-.46 2.37-2.52 3.65-4.57 3.65-2.73 0-5.07-2.07-5.07-5.1 0-3.03 2.34-5.1 5.07-5.1 1.44 0 2.76.5 3.75 1.48l2.13-2.13C15.6 3.64 13.75 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.97 0 9-4.03 9-9 0-.64-.07-1.27-.2-1.9z" />
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 text-xs text-zinc-500 uppercase">
              <div className="flex-1 h-px bg-white/10" />
              OR
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email Field */}
            <TextField isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm text-zinc-300">Email Address</Label>
              <InputGroup className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-blue-500">
                <At className="text-zinc-500" size={16} />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 bg-transparent outline-none text-white"
                />
              </InputGroup>
            </TextField>

            {/* Password Field */}
            <TextField isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm text-zinc-300">Password</Label>
              <InputGroup className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-blue-500">
                <ShieldKeyhole className="text-zinc-500" size={16} />
                <Input
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 bg-transparent outline-none text-white"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="text-zinc-500"
                >
                  {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </InputGroup>
            </TextField>

            {/* Sign In Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full font-bold text-white bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] hover:opacity-90 transition-opacity mt-2"
            >
              Sign In
            </Button>

            {/* Footer Link */}
            <div className="text-center mt-2 text-sm text-zinc-400">
              New to Promptrix?{" "}
              <Link
                href={`/auth/signup?redirect=${encodeURIComponent(redirectTo)}`}
                className="text-blue-400 font-medium"
              >
                Create an account
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}