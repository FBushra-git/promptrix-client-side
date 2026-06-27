import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PaymentPage({ searchParams }) {
  const params = await searchParams;
  const redirectTo = params?.redirect || "/prompts";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/auth/signin?redirect=/payment?redirect=${redirectTo}`);
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] px-4 py-12 text-white">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
            Premium Plan
          </p>

          <h1 className="text-5xl font-black italic">
            Unlock{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              Premium
            </span>
          </h1>

          <p className="mt-4 text-white/50">
            One-time payment to access all private premium prompts.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-[#121322] p-6">
            <p className="text-sm text-white/45">One-time payment</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-6xl font-black">$5</span>
              <span className="mb-2 text-white/45">USD</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <h2 className="text-2xl font-black italic">Premium Benefits</h2>

          <div className="mt-6 space-y-4">
            {[
              "Access all private premium prompts",
              "Copy premium prompt content",
              "Review and rate private prompts",
              "Lifetime unlock for this account",
            ].map((benefit) => (
              <div
                key={benefit}
                className="rounded-2xl border border-white/10 bg-[#121322] p-4 text-white/80"
              >
                {benefit}
              </div>
            ))}
          </div>

          <form action="/api/checkout_sessions" method="POST" className="mt-8">
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-6 py-4 font-black text-white shadow-xl shadow-[#967bb6]/20 transition hover:scale-[1.01]"
            >
              Pay $5 and Unlock Premium
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}