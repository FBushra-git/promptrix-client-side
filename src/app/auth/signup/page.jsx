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
import {
  Eye,
  EyeSlash,
  Person,
  At,
  ShieldKeyhole,
  Picture,
} from "@gravity-ui/icons";
import { signUp } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [role, setRole] = useState("User");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error: authError } = await signUp.email({
        email,
        password,
        name,
        image: photoURL,
        // Ensure your auth-client backend handles the role property
        additionalData: { role }, 
      });

      if (authError) {
        toast.error("Signup failed", { description: authError.message });
      } else {
        toast.success("Account created!", { 
            description: "Welcome to Promptrix. Redirecting you..." 
        });
        router.push(redirectTo);
      }
    } catch (err) {
      toast.error("Network Error", { description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#1a1a2e] px-4 py-10">
      {/* Gradient Border Wrapper */}
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/50 to-blue-500/50 w-full max-w-md">
        <Card className="w-full p-6 bg-[#1a1a2e] backdrop-blur-xl border border-white/10 shadow-2xl">
          
          {/* Header with Logo */}
          <div className="flex flex-col items-center justify-center gap-2 pb-6 text-center">
            <img src="/logo.png" alt="Promptrix" className="h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold text-white">Promptrix</h1>
            <p className="text-sm text-zinc-400">Join the community to start creating</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Name */}
            <TextField isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm text-zinc-300">Name</Label>
              <InputGroup className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-blue-500">
                <Person className="text-zinc-500" size={16} />
                <Input value={name} onChange={(e) => setName(e.target.value)} className="w-full py-2 bg-transparent outline-none text-white" />
              </InputGroup>
            </TextField>

            {/* Email */}
            <TextField isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm text-zinc-300">Email</Label>
              <InputGroup className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-blue-500">
                <At className="text-zinc-500" size={16} />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-2 bg-transparent outline-none text-white" />
              </InputGroup>
            </TextField>

            {/* Photo URL */}
            <TextField className="flex flex-col gap-1.5">
              <Label className="text-sm text-zinc-300">Photo URL (Optional)</Label>
              <InputGroup className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-blue-500">
                <Picture className="text-zinc-500" size={16} />
                <Input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="https://..." className="w-full py-2 bg-transparent outline-none text-white" />
              </InputGroup>
            </TextField>

            {/* Password */}
            <TextField isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm text-zinc-300">Password</Label>
              <InputGroup className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-blue-500">
                <ShieldKeyhole className="text-zinc-500" size={16} />
                <Input type={isVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-2 bg-transparent outline-none text-white" />
                <button type="button" onClick={() => setIsVisible(!isVisible)} className="text-zinc-500">
                  {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </InputGroup>
            </TextField>

            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-zinc-300">Account Type</Label>
              <div className="flex gap-2">
                {["User", "Creator", "Admin"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                      role === option
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full font-bold text-white bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] hover:opacity-90 transition-opacity mt-2"
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center mt-4 text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-400 font-medium">Sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}