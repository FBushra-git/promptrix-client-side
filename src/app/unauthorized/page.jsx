import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import BackButton from "./BackButton";

export default function UnauthorizedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1a1a2e] px-4 py-10 text-white">
      <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#967bb6]/10 blur-[120px]" />

      <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/70 to-transparent" />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/30 bg-red-500/10 text-red-200 shadow-lg shadow-red-500/10">
          <ShieldAlert size={38} />
        </div>

        <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-red-200">
          Access Denied
        </p>

        <h1 className="mt-3 text-5xl font-black italic tracking-tight text-white md:text-6xl">
          Unauthorized
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/50">
          You do not have permission to view this dashboard or resource. Try
          signing in with an account that has the correct role.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white/70 transition hover:border-[#967bb6]/60 hover:text-white"
          >
            <Home size={16} />
            Home
          </Link>

          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.02]"
          >
            <LogIn size={16} />
            Sign In
          </Link>

          <BackButton />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#121322]/80 p-4 text-left">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#967bb6]">
            Role Tip
          </p>

          <p className="mt-2 text-sm leading-6 text-white/45">
            Admin routes require an account with{" "}
            <span className="font-bold text-white">role: admin</span>. Creator
            routes require{" "}
            <span className="font-bold text-white">role: creator</span>.
          </p>
        </div>
      </section>
    </main>
  );
}