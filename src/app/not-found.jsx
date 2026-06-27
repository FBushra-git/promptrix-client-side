import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1a2e] px-4 text-white">
      <section className="max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-8xl font-black italic text-[#967bb6]">404</p>

        <h1 className="mt-4 text-4xl font-black italic">
          Page Not Found
        </h1>

        <p className="mt-3 text-white/45">
          This route does not exist, or the page has moved.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-6 py-3 text-sm font-black text-white"
          >
            <Home size={16} />
            Go Home
          </Link>

          <Link
            href="/prompts"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-black text-white/70 hover:bg-white/5"
          >
            <Search size={16} />
            Browse Prompts
          </Link>
        </div>
      </section>
    </main>
  );
}