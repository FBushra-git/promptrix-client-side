import { requireAdmin } from "@/lib/core/requireAdmin";
import { getAllReports } from "@/lib/api/admin";
import AdminReportsTable from "./AdminReportsTable";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await getAllReports();

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">Moderation Queue</p>
          <h1 className="mt-3 text-4xl font-black italic">Reported Prompts</h1>
          <p className="mt-2 text-white/45">Remove harmful prompts, warn creators, or dismiss safe content.</p>
        </div>

        <AdminReportsTable reports={Array.isArray(reports) ? reports : []} />
      </section>
    </main>
  );
}