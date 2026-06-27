import Link from "next/link";
import { requireAdmin } from "@/lib/core/requireAdmin";
import { getAdminStats } from "@/lib/api/admin";
import { Users, FileText, Star, Copy, ShieldCheck, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Total Prompts", value: stats.totalPrompts, icon: FileText },
    { label: "Total Reviews", value: stats.totalReviews, icon: Star },
    { label: "Total Copies", value: stats.totalCopies, icon: Copy },
  ];

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">
            Admin Control Room
          </p>
          <h1 className="mt-3 text-5xl font-black italic">
            Platform <span className="text-[#967bb6]">Command</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Review prompts, moderate reports, monitor payments, and control platform roles.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-[#121322] p-6 shadow-xl shadow-black/20"
            >
              <card.icon className="mb-5 text-[#967bb6]" size={28} />
              <p className="text-sm text-white/45">{card.label}</p>
              <h2 className="mt-2 text-4xl font-black">{card.value || 0}</h2>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <AdminLink href="/dashboard/admin/prompts" icon={ShieldCheck} title="Review Prompts" text="Approve, reject, feature, or delete creator submissions." />
          <AdminLink href="/dashboard/admin/users" icon={Users} title="Manage Users" text="Change roles and remove harmful accounts." />
          <AdminLink href="/dashboard/admin/reports" icon={AlertTriangle} title="Reported Prompts" text="Handle community reports and warnings." />
        </div>
      </section>
    </main>
  );
}

function AdminLink({ href, icon: Icon, title, text }) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-[#967bb6]/70 hover:bg-white/[0.07]"
    >
      <Icon className="text-[#967bb6]" />
      <h3 className="mt-5 text-2xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
    </Link>
  );
}