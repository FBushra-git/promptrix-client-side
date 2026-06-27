import { requireAdmin } from "@/lib/core/requireAdmin";
import { getAllPromptsForAdmin } from "@/lib/api/admin";
import AdminPromptsTable from "./AdminPromptsTable";

export const dynamic = "force-dynamic";

export default async function AdminPromptsPage() {
  await requireAdmin();
  const data = await getAllPromptsForAdmin();
  const prompts = data?.prompts || [];

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/25">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">Prompt Review Deck</p>
          <h1 className="mt-3 text-4xl font-black italic">All Prompts</h1>
          <p className="mt-2 text-white/45">Approve, reject, feature, or delete prompt submissions.</p>
        </div>

        <AdminPromptsTable prompts={prompts} />
      </section>
    </main>
  );
}