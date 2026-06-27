import Link from "next/link";
import PromptCard from "./PromptCard";

export default function LatestPrompts({ prompts = [] }) {
  const latestPrompts = prompts.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
            Fresh Drops
          </p>

          <h2 className="text-4xl font-black italic text-white">
            Latest{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              Prompts
            </span>
          </h2>

          <p className="mt-2 text-white/50">
            New prompt drops from the creator lab.
          </p>
        </div>

        <Link
          href="/prompts"
          className="w-fit rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-5 py-2 text-sm font-bold text-white"
        >
          View All
        </Link>
      </div>

      {latestPrompts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/50">
          No prompts added yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestPrompts.map((prompt, index) => (
            <PromptCard key={prompt._id} prompt={prompt} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

