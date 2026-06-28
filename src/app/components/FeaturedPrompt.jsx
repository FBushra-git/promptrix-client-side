
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getPrompts } from "@/lib/api/prompts";

const tabs = ["Midjourney", "DALL-E", "Claude", "ChatGPT", "Design", "Coding"];

export default async function FeaturedPrompts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const data = await getPrompts({
    publicOnly: "true",
    sort: "most-copied",
    limit: "6",
  });

  const prompts = data?.prompts || [];
  const isLoggedIn = Boolean(session?.user);

  return (
    <section className="relative overflow-hidden bg-[#1a1a2e] px-4 py-20 text-white">
      <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#967bb6]/15 blur-[120px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
            Featured Drops
          </p>

          <h2 className="text-4xl font-black italic md:text-5xl">
            Trending{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              Prompts
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-white/50">
            Six high-performing public prompts, ranked by creator engagement and
            copy count.
          </p>
        </div>

        <div className="mb-14 grid grid-cols-2 gap-4 text-center text-base font-black text-white/25 md:grid-cols-3 lg:grid-cols-6 lg:text-xl">
          {tabs.map((tab) => (
            <span
              key={tab}
              className="rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3 transition hover:border-[#967bb6]/50 hover:text-[#cdb7e8]"
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#967bb6]">
              Featured Collection
            </p>
            <h3 className="mt-1 text-2xl font-black italic text-white">
              Top Creator Prompts
            </h3>
          </div>

          <div className="flex gap-3">
            <Link
              href="/prompts?sort=most-copied"
              className="rounded-2xl border border-white/10 bg-[#121322]/80 px-5 py-3 text-xs font-bold text-white/70 transition hover:border-[#967bb6] hover:text-white"
            >
              Top Prompts
            </Link>

            <Link
              href="/prompts?sort=latest"
              className="rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.03] hover:opacity-95"
            >
              New Prompts
            </Link>
          </div>
        </div>

        {prompts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center shadow-xl shadow-black/20">
            <h2 className="text-2xl font-black">No featured prompts yet</h2>
            <p className="mt-2 text-white/45">
              Add public prompts to feature them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {prompts.map((prompt, index) => (
              <FeaturedPromptCard
                key={prompt._id}
                prompt={prompt}
                index={index}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/prompts"
            className="rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-12 py-4 text-sm font-black text-white shadow-xl shadow-[#967bb6]/20 transition hover:scale-[1.03] hover:opacity-95"
          >
            Explore More Prompts →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedPromptCard({ prompt, index, isLoggedIn }) {
  const detailHref = isLoggedIn
    ? `/dashboard/creator/prompts/${prompt._id}`
    : `/auth/signin?redirect=/dashboard/creator/prompts/${prompt._id}`;

  return (
    <article
      className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] p-2 shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-[#967bb6]/70 hover:bg-white/[0.075]"
      style={{
        animation: `promptFadeUp 0.5s ease ${index * 60}ms both`,
      }}
    >
      <div className="relative h-40 overflow-hidden rounded-lg bg-[#121322]">
        {prompt.thumbnail ? (
          <img
            src={prompt.thumbnail}
            alt={prompt.title || "Prompt thumbnail"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-white/35">
            No Image
          </div>
        )}

        <span className="absolute left-2 top-2 rounded-md bg-[#121322]/85 px-2 py-1 text-[10px] font-black text-white">
          {prompt.aiTool || "AI"}
        </span>

        <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#121322]/85 text-lg text-white">
          ♡
        </span>
      </div>

      <div className="px-1 pb-2 pt-3">
        <h3 className="line-clamp-1 text-sm font-black text-white">
          {prompt.title}
        </h3>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-xs text-[#cdb7e8]">
            {prompt.category || "Prompt"}
          </p>

          <p className="text-xs font-black text-[#8a96ce]">
            {prompt.copyCount || 0} copies
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="max-w-[90px] truncate text-[11px] text-white/40">
            {prompt.creatorName || "Creator"}
          </p>

          <Link
            href={detailHref}
            className="rounded-md bg-[#967bb6]/20 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#967bb6]"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}