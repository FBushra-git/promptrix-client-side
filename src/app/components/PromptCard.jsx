import Link from "next/link";

export default function PromptCard({ prompt, index = 0 }) {
  const tags =
    typeof prompt.tags === "string"
      ? prompt.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : Array.isArray(prompt.tags)
        ? prompt.tags
        : [];

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#967bb6]/80 hover:bg-white/[0.075]"
      style={{
        animation: `promptFadeUp 0.55s ease ${index * 70}ms both`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent opacity-0 transition group-hover:opacity-100" />

      <div
        className="mb-4 h-48 rounded-2xl border border-white/10 bg-cover bg-center"
        style={{
          backgroundImage: prompt.thumbnail
            ? `linear-gradient(rgba(18,19,34,.05), rgba(18,19,34,.25)), url("${prompt.thumbnail}")`
            : "linear-gradient(135deg, #121322, #2b2440)",
        }}
      />

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#967bb6]/20 px-3 py-1 text-xs font-semibold capitalize text-[#dccaf2]">
          {prompt.category || "Uncategorized"}
        </span>

        <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-white/50">
          {prompt.difficulty || "N/A"}
        </span>
      </div>

      <h2 className="line-clamp-2 min-h-[3.5rem] text-2xl font-black leading-tight text-white">
        {prompt.title}
      </h2>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
        {prompt.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-[#121322] px-2.5 py-1 text-xs text-white/60"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <InfoPill label="AI Tool" value={prompt.aiTool || "N/A"} />
        <InfoPill label="Copies" value={prompt.copyCount || 0} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-white/40">Creator</p>
          <p className="max-w-[160px] truncate text-sm font-semibold text-white/80">
            {prompt.creatorName || prompt.creatorEmail || "Unknown"}
          </p>
        </div>

        <Link
          href={`/dashboard/creator/prompts/${prompt._id}`}
          className="rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.03]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121322]/80 p-3">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 truncate font-semibold text-white/80">{value}</p>
    </div>
  );
}