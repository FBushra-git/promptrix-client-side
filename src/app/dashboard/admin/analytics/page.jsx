import { requireAdmin } from "@/lib/core/requireAdmin";
import {
  getAdminStats,
  getAllPromptsForAdmin,
  getAllUsers,
  getAllPaymentsForAdmin,
} from "@/lib/api/admin";
import AdminAnalyticsCharts from "./AdminAnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [stats, promptsData, users, payments] = await Promise.all([
    getAdminStats(),
    getAllPromptsForAdmin(),
    getAllUsers(),
    getAllPaymentsForAdmin(),
  ]);

  const prompts = promptsData?.prompts || [];

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/25">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent" />

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">
            Platform Pulse
          </p>

          <h1 className="mt-3 text-4xl font-black italic">
            Admin <span className="text-[#967bb6]">Analytics</span>
          </h1>

          <p className="mt-2 text-white/45">
            Live platform intelligence from users, prompts, reviews, copies, and payments.
          </p>
        </div>

        <AdminAnalyticsCharts
          stats={stats}
          prompts={prompts}
          users={Array.isArray(users) ? users : []}
          payments={Array.isArray(payments) ? payments : []}
        />
      </section>
    </main>
  );
}