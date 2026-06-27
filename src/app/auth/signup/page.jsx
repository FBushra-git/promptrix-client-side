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
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaChrome } from "react-icons/fa";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [role, setRole] = useState("user");

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
        image: photoURL || undefined,
        role,
      });

      if (authError) {
        toast.error("Signup failed");
      } else {
        toast.success("Account created!");
        router.push(redirectTo);
      }
    } catch (err) {
      toast.error("Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (err) {
      toast.error("Google signup failed");
      setIsLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#1a1a2e] bg-center bg-no-repeat px-4 py-6 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(26,26,46,.8), rgba(18,19,34,.92)), url('/sign-up-bg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#967bb6]/20 blur-[120px]" />

      <section className="relative z-10 w-full max-w-[410px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-[1px] shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Card className="border-0 bg-[#121322]/85 p-5 shadow-none">
            <div className="mb-4 text-center">
              <img
                src="/logo.png"
                alt="Promptrix"
                className="mx-auto h-10 w-10 object-contain"
              />

              <h1 className="mt-2 text-2xl font-black text-white">
                Promptrix
              </h1>

              <p className="mt-1 text-sm text-white/45">
                Create your prompt marketplace account.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#967bb6]">
                Sign Up
              </p>

              <h2 className="mt-1 text-3xl font-black italic text-white">
                Create Account
              </h2>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="mb-3 h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] font-bold text-white transition hover:border-[#967bb6]/70 hover:bg-white/[0.1]"
            >
              <FaChrome size={18} />
              Continue with Google
            </Button>

            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                or create with email
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <AuthField label="Name" icon={<Person size={16} />}>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent py-1.5 text-white outline-none"
                />
              </AuthField>

              <AuthField label="Email" icon={<At size={16} />}>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-1.5 text-white outline-none"
                />
              </AuthField>

              <AuthField
                label="Photo URL (Optional)"
                icon={<Picture size={16} />}
                required={false}
              >
                <Input
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-transparent py-1.5 text-white outline-none placeholder:text-white/25"
                />
              </AuthField>

              <AuthField label="Password" icon={<ShieldKeyhole size={16} />}>
                <Input
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-1.5 text-white outline-none"
                />

                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="text-white/40 transition hover:text-white"
                >
                  {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </AuthField>

              <div className="flex flex-col gap-2">
                <Label className="text-sm text-white/60">Account Type</Label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "user", label: "user" },
                    { value: "creator", label: "creator" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`rounded-xl border py-2 text-sm font-bold transition-all ${
                        role === option.value
                          ? "border-[#967bb6] bg-[#967bb6]/20 text-white shadow-lg shadow-[#967bb6]/10"
                          : "border-white/10 bg-[#121322] text-white/45 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] font-bold text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.01]"
              >
                Sign Up
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-white/45">
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-bold text-[#cdb7e8]">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

function AuthField({ label, icon, children, required = true }) {
  return (
    <TextField isRequired={required} className="flex flex-col gap-1">
      <Label className="text-sm text-white/60">{label}</Label>

      <InputGroup className="rounded-xl border border-white/10 bg-[#121322] px-3 text-white transition focus-within:border-[#967bb6] focus-within:ring-2 focus-within:ring-[#967bb6]/20">
        <span className="text-white/35">{icon}</span>
        {children}
      </InputGroup>
    </TextField>
  );
}