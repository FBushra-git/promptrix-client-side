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
import { FaChrome } from "react-icons/fa";

export default function SigninPage() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState(searchParams.get("password") || "");

  const router = useRouter();

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error: authError } = await signIn.email({
        email,
        password,
      });

      if (authError) {
        toast.error("Signin failed");
      } else {
        toast.success("Welcome back!");
        router.push(redirectTo);
      }
    } catch (err) {
      toast.error("Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setIsLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (err) {
      toast.error("Google signin failed");
      setIsLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#1a1a2e] bg-cover bg-center px-4 py-10 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(26,26,46,.82), rgba(18,19,34,.92)), url('/sign-up-bg.png')",
      }}
    >
      <div className="absolute right-1/2 top-0 h-[520px] w-[520px] translate-x-1/2 rounded-full bg-[#967bb6]/20 blur-[120px]" />

      <section className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-[1px] shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Card className="border-0 bg-[#121322]/80 p-6 shadow-none sm:p-8">
            <div className="mb-8 text-center">
              <img
                src="/logo.png"
                alt="Promptrix"
                className="mx-auto h-12 w-12 object-contain"
              />

              <h1 className="mt-3 text-2xl font-black text-white">Promptrix</h1>

              <p className="mt-1 text-sm text-white/45">
                Sign in to access your prompt hub.
              </p>
            </div>

            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#967bb6]">
                Login
              </p>

              <h2 className="mt-2 text-3xl font-black italic text-white">
                Welcome Back
              </h2>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignin}
              disabled={isLoading}
              className="mb-5 h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] font-bold text-white transition hover:border-[#967bb6]/70 hover:bg-white/[0.1]"
            >
              <FaChrome size={18} />
              Continue with Google
            </Button>

            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                or email
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleSignin} className="flex flex-col gap-4">
              <AuthField label="Email" icon={<At size={16} />}>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-2 text-white outline-none"
                />
              </AuthField>

              <AuthField label="Password" icon={<ShieldKeyhole size={16} />}>
                <Input
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-2 text-white outline-none"
                />

                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="text-white/40 transition hover:text-white"
                >
                  {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </AuthField>

              <Button
                type="submit"
                isLoading={isLoading}
                className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] font-bold text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.01]"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-white/45">
              New to Promptrix?{" "}
              <Link href="/auth/signup" className="font-bold text-[#cdb7e8]">
                Create account
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
    <TextField isRequired={required} className="flex flex-col gap-1.5">
      <Label className="text-sm text-white/60">{label}</Label>

      <InputGroup className="rounded-xl border border-white/10 bg-[#121322] px-3 text-white transition focus-within:border-[#967bb6] focus-within:ring-2 focus-within:ring-[#967bb6]/20">
        <span className="text-white/35">{icon}</span>
        {children}
      </InputGroup>
    </TextField>
  );
}
