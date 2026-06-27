import { requireAdmin } from "@/lib/core/requireAdmin";
import { getAllUsers } from "@/lib/api/admin";
import AdminUsersTable from "./AdminUsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAllUsers();

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Identity Matrix"
          title="All Users"
          text="Change roles, inspect premium access, and remove harmful accounts."
        />
        <AdminUsersTable users={Array.isArray(users) ? users : []} />
      </section>
    </main>
  );
}

function PageHeader({ eyebrow, title, text }) {
  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/25">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-black italic">{title}</h1>
      <p className="mt-2 text-white/45">{text}</p>
    </div>
  );
}