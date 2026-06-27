import Link from "next/link";
import { getPrompts } from "@/lib/api/prompts";

export const dynamic = "force-dynamic";

const aiTools = [
  "ChatGPT",
  "Gemini",
  "Claude",
  "Midjourney",
  "Stable Diffusion",
  "DALL-E 3",
  "Other",
];

const categories = [
  "coding",
  "writing",
  "marketing",
  "graphics & image",
  "idea generation",
  "system assistant",
  "art",
  "education",
  "business",
  "other",
];

const difficulties = ["beginner", "intermediate", "pro"];

const perPage = 6;

export default async function PromptsPage({ searchParams }) {
  const params = await searchParams;

  const search = params?.search || "";
  const aiTool = params?.aiTool || "";
  const category = params?.category || "";
  const difficulty = params?.difficulty || "";
  const sort = params?.sort || "latest";
  const page = Number(params?.page || 1);

  const data = await getPrompts({
    publicOnly: "true",
  status: "approved",
    search,
    aiTool,
    category,
    difficulty,
    sort,
    page,
    perPage,
  });

  const prompts = data?.prompts || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const baseParams = {
    search,
    aiTool,
    category,
    difficulty,
    sort,
  };

  return (
    <main className="min-h-screen bg-[#1a1a2e] px-4 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-[#967bb6]">
              Prompt Library
            </p>
            <h1 className="text-4xl font-black italic tracking-tight">
              Explore{" "}
              <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
                Prompts
              </span>
            </h1>
            <p className="mt-2 text-sm text-[#7790bd]">
              Showing {prompts.length} of {total} verified AI prompts
            </p>
          </div>

          <form action="/prompts" className="w-full lg:max-w-xl">
            <input type="hidden" name="aiTool" value={aiTool} />
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="difficulty" value={difficulty} />
            <input type="hidden" name="sort" value={sort} />

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#61759b]">
                ⌕
              </span>
              <input
                name="search"
                defaultValue={search}
                placeholder="Search prompt, tag, tool..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#607194] focus:border-[#967bb6] focus:ring-2 focus:ring-[#967bb6]/20"
              />
            </div>
          </form>
        </div>

        <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-sm font-black">☷ Filters</h2>
              <Link
                href="/prompts"
                className="text-xs font-bold text-white/50 transition hover:text-white"
              >
                Reset
              </Link>
            </div>

            <div className="space-y-6">
              <FilterGroup title="AI Engine">
                <FilterOption
                  params={baseParams}
                  paramName="aiTool"
                  value=""
                  label="All"
                  activeValue={aiTool}
                />

                {aiTools.map((tool) => (
                  <FilterOption
                    key={tool}
                    params={baseParams}
                    paramName="aiTool"
                    value={tool}
                    label={tool}
                    activeValue={aiTool}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Category">
                <FilterOption
                  params={baseParams}
                  paramName="category"
                  value=""
                  label="All"
                  activeValue={category}
                />

                {categories.map((item) => (
                  <FilterOption
                    key={item}
                    params={baseParams}
                    paramName="category"
                    value={item}
                    label={capitalize(item)}
                    activeValue={category}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="Difficulty">
                <FilterOption
                  params={baseParams}
                  paramName="difficulty"
                  value=""
                  label="All"
                  activeValue={difficulty}
                />

                {difficulties.map((item) => (
                  <FilterOption
                    key={item}
                    params={baseParams}
                    paramName="difficulty"
                    value={item}
                    label={capitalize(item)}
                    activeValue={difficulty}
                  />
                ))}
              </FilterGroup>
            </div>
          </aside>

          <section>
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-white/50">
                  Sort By:
                </span>

                <SortLink
                  params={baseParams}
                  current={sort}
                  value="latest"
                  label="Latest"
                />
                <SortLink
                  params={baseParams}
                  current={sort}
                  value="most-popular"
                  label="Most Popular"
                />
                <SortLink
                  params={baseParams}
                  current={sort}
                  value="most-copied"
                  label="Most Copied"
                />
              </div>
            </div>

            {prompts.length === 0 ? (
              <div className="rounded-2xl border border-white/10  bg-white/[0.04] p-12 text-center shadow-xl shadow-black/20">
                <h2 className="text-2xl font-black">No prompts found</h2>
                <p className="mt-2 text-white/50">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {prompts.map((prompt, index) => (
                  <PromptCard key={prompt._id} prompt={prompt} index={index} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              params={baseParams}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function PromptCard({ prompt, index }) {
  const isPremium = prompt.isVisible === false;

  const tags =
    typeof prompt.tags === "string"
      ? prompt.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : Array.isArray(prompt.tags)
        ? prompt.tags
        : [];

  return (
    <article
      className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#7c3aed]/70 hover:bg-[#10182c]"
      style={{
        animation: `promptFadeUp 0.45s ease ${index * 60}ms both`,
      }}
    >
      <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-white/10 bg-[#0a1020]">
        {prompt.thumbnail ? (
          <img
            src={prompt.thumbnail}
            alt={prompt.title || "Prompt thumbnail"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#607194]">
            ✣
          </div>
        )}

        {isPremium && (
          <span className="absolute right-3 top-3 rounded-full border border-[#967bb6]/40 bg-[#967bb6]/20 px-3 py-1 text-[10px] font-black uppercase text-[#dfcff4]">
            Premium
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-300">
          {prompt.aiTool || "AI"}
        </span>

        <span className="rounded-full border border-[#34405d] px-2 py-1 text-[10px] uppercase text-[#9db0d4]">
          {prompt.difficulty || "Beginner"}
        </span>
      </div>

      <h3 className="line-clamp-1 text-xl font-black text-white">
        {prompt.title}
      </h3>

      <p className="mt-4 line-clamp-2 min-h-[2.5rem] text-sm text-[#8fa3cf]">
        {prompt.description}
      </p>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
          # {prompt.category || "Other"}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[#111a30] px-2 py-1 text-[10px] text-[#9db0d4]"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/50">
        <span>⌁ {prompt.creatorName || "Creator"}</span>
        <span>□ {prompt.copyCount || 0}</span>
        <span>★ {prompt.avgRating || prompt.rating || "0.0"}</span>
      </div>

      <Link
        href={`/dashboard/creator/prompts/${prompt._id}`}
        className="mt-4 block rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] py-3 text-center text-xs font-black text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02]"
      >
        ◉ View Details
      </Link>
    </article>
  );
}

function Pagination({ currentPage, totalPages, params }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-10 flex justify-center border-t border-white/10 pt-8">
      <div className="flex items-center gap-3 rounded-2xl border border-[#25304a] bg-[#0d1324] p-3 shadow-xl shadow-black/20">
        <PageButton
          disabled={currentPage <= 1}
          href={buildHref(params, currentPage - 1)}
        >
          ‹
        </PageButton>

        {pages.map((page) => (
          <PageButton
            key={page}
            active={page === currentPage}
            href={buildHref(params, page)}
          >
            {page}
          </PageButton>
        ))}

        <PageButton
          disabled={currentPage >= totalPages}
          href={buildHref(params, currentPage + 1)}
        >
          ›
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({ children, href, active, disabled }) {
  if (disabled) {
    return (
      <span className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#25304a] bg-[#11182a] px-3 text-[#52617f]">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-black transition ${
        active
          ? "bg-[#8b3ff4] text-white shadow-lg shadow-purple-500/25"
          : "text-[#9db0d4] hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#8fa3cf]">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterOption({ params, paramName, value, label, activeValue }) {
  const active = activeValue === value;

  const nextParams = {
    ...params,
    [paramName]: value,
  };

  return (
    <Link
      href={buildHref(nextParams, 1)}
      className={`block rounded-lg border px-3 py-2 text-xs font-medium transition ${
        active
          ? "border-[#967bb6] bg-[#967bb6]/20 text-white shadow shadow-[#967bb6]/10"
          : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function SortLink({ params, current, value, label }) {
  return (
    <Link
      href={buildHref({ ...params, sort: value }, 1)}
      className={`rounded-lg px-4 py-2 text-xs font-black transition ${
        current === value
          ? "bg-[#967bb6]/20 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function buildHref(params, page) {
  const query = new URLSearchParams();

  Object.entries({ ...params, page }).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  return `/prompts?${query.toString()}`;
}

function capitalize(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
