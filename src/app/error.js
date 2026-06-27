"use client";

import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1a2e] px-4 text-white">
      <section className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#967bb6]">
          System Error
        </p>

        <h1 className="mt-3 text-4xl font-black italic">
          Something Went Wrong
        </h1>

        <p className="mt-3 text-white/45">
          {error?.message || "The page could not be loaded."}
        </p>

        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-6 py-3 text-sm font-black text-white"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </section>
    </main>
  );
}
