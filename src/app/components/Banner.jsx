import Link from "next/link";

const trendingTags = [
  "cyberpunk",
  "react",
  "logo design",
  "automation",
  "marketing",
  "seo",
  "midjourney",
  "productivity",
];

export default function Banner() {
  return (
    <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-[#1a1a2e]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(26,26,46,0.96) 0%, rgba(26,26,46,0.82) 45%, rgba(26,26,46,0.45) 100%), url("/banner-bg.png")',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(150,123,182,0.22),transparent_32%),radial-gradient(circle_at_78%_30%,rgba(138,150,206,0.18),transparent_28%)]" />

      <div className="navbar-gradient-line absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#967bb6] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#cdb7e8] backdrop-blur">
            AI Prompt Marketplace
          </p>

          <h1 className="text-5xl font-black italic leading-[0.95] text-white md:text-7xl">
            Build Faster With{" "}
            <span className="bg-gradient-to-r from-[#967bb6] via-[#8a96ce] to-white bg-clip-text text-transparent">
              Prompt Power
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Discover ready-to-use prompts for AI art, coding, automation,
            productivity, and creative workflows.
          </p>

          <form
            action="/prompts"
            className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-[#121322]/80 p-2 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row"
          >
            <input
              name="search"
              placeholder="Search prompts, tags, AI tools..."
              className="h-14 flex-1 rounded-xl bg-transparent px-4 text-white outline-none placeholder:text-white/35"
            />

            <button
              type="submit"
              className="h-14 rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-7 text-sm font-bold text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.02]"
            >
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-white/45">
              Trending:
            </span>

            {trendingTags.map((tag) => (
              <Link
                key={tag}
                href={`/prompts?search=${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/65 transition hover:border-[#967bb6]/70 hover:bg-[#967bb6]/15 hover:text-white"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/prompts"
              className="rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.03]"
            >
              Explore Prompts
            </Link>

            <Link
              href="/dashboard/creator/prompts/add-prompt"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/80 transition hover:border-[#967bb6] hover:text-white"
            >
              Add Prompt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}