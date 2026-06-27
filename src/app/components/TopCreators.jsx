import { getPrompts } from "@/lib/api/prompts";
import { Crown, Copy, FileText, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function TopCreators() {
  const data = await getPrompts({
    publicOnly: "true",
    status: "approved",
  });

  const prompts = data?.prompts || [];

  const creators = Object.values(
    prompts.reduce((acc, prompt) => {
      const key = prompt.creatorEmail || "unknown";

      if (!acc[key]) {
        acc[key] = {
          name: prompt.creatorName || "Unknown Creator",
          email: prompt.creatorEmail || "No email",
          prompts: 0,
          copies: 0,
          tools: new Set(),
        };
      }

      acc[key].prompts += 1;
      acc[key].copies += Number(prompt.copyCount || 0);

      if (prompt.aiTool) {
        acc[key].tools.add(prompt.aiTool);
      }

      return acc;
    }, {})
  )
    .map((creator) => ({
      ...creator,
      tools: Array.from(creator.tools).slice(0, 3),
    }))
    .sort((a, b) => b.copies - a.copies)
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#967bb6]">
            Creator Board
          </p>

          <h2 className="mt-3 text-5xl font-black uppercase italic tracking-tight text-white">
            Top Creators
          </h2>
        </div>

        <Link
          href="/prompts"
          className="hidden items-center gap-2 text-lg font-black text-white transition hover:text-[#967bb6] md:flex"
        >
          View All
          <ArrowRight />
        </Link>
      </div>

      {creators.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/45">
          No approved creators yet.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-4">
          {creators.map((creator, index) => (
            <article
              key={creator.email}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121322] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#967bb6]/60"
            >
              <div className="relative h-36 bg-gradient-to-br from-[#d946ef] via-[#967bb6] to-[#8a96ce]">
                <div className="absolute bottom-4 left-5 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-sm font-black text-white backdrop-blur">
                  <Trophy size={16} />
                  Rank {index + 1}
                </div>

                <div className="absolute left-1/2 top-8 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-3xl font-black text-white shadow-2xl backdrop-blur">
                  {creator.name?.charAt(0) || "C"}
                </div>
              </div>

              <div className="p-6">
                <h3 className="line-clamp-1 text-2xl font-black text-white">
                  {creator.name}
                </h3>

                <p className="mt-1 truncate text-sm text-white/35">
                  {creator.email}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill icon={FileText} text={`${creator.prompts} prompts`} />
                  <Pill icon={Copy} text={`${creator.copies} copies`} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {creator.tools.length === 0 ? (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white/35">
                      No tools
                    </span>
                  ) : (
                    creator.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full bg-[#967bb6]/15 px-3 py-1 text-xs font-bold text-[#dfcff4]"
                      >
                        {tool}
                      </span>
                    ))
                  )}
                </div>

                {index === 0 && (
                  <div className="mt-5 flex items-center gap-2 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-100">
                    <Crown size={16} />
                    Leading Creator
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Pill({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/60">
      <Icon size={13} />
      {text}
    </span>
  );
}