"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function PremiumLock({ redirectTo = "/prompts" }) {
  const router = useRouter();

  return (
    <div className="rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.04] p-12 text-center">
      <h3 className="mb-4 text-2xl font-black text-white">
        This is a Premium Prompt
      </h3>

      <p className="mx-auto mb-6 max-w-md text-zinc-400">
        Subscribe once for $5 to unlock all private prompts, copy premium
        content, and submit premium reviews.
      </p>

      <Button
        onClick={() =>
          router.push(`/payment?redirect=${encodeURIComponent(redirectTo)}`)
        }
        className="bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] font-bold text-white"
      >
        Subscribe to Premium
      </Button>

      <p className="mt-4 text-sm italic text-zinc-600">
        One-time payment. Lifetime premium access.
      </p>
    </div>
  );
}