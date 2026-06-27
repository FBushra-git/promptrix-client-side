import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCreatorPrompts } from "@/lib/api/prompts";
import { getUserByEmail } from "@/lib/api/users";
import { FileText, Bookmark, Star, Crown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/auth/signin");

  const dbUser = await getUserByEmail(session.user.email);
  const user = { ...session.user, ...dbUser };

  const promptsData = await getCreatorPrompts(user.email);
  const prompts = promptsData?.prompts || [];

  const stats = [
    { label: "My Prompts", value: prompts.length, icon: FileText },
    { label: "Saved Prompts", value: "View", icon: Bookmark },
    { label: "My Reviews", value: "View", icon: Star },
    {
      label: "Subscription",
      value: user.isPremium ? "Premium" : "Free",
      icon: Crown,
    },
  ];

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/25">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">
            Member Dashboard
          </p>

          <h1 className="mt-3 text-5xl font-black italic">
            Welcome, <span className="text-[#967bb6]">{user.name}</span>
          </h1>

          <p className="mt-3 text-white/45">
            Save prompts, submit your own drops, review content, and manage your profile.
          </p>

          {!user.isPremium && (
            <Link
              href="/payment"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#967bb6]/20"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-[#121322] p-6"
            >
              <stat.icon className="text-[#967bb6]" size={28} />
              <p className="mt-6 text-sm text-white/45">{stat.label}</p>
              <h2 className="mt-2 text-3xl font-black">{stat.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardLink href="/dashboard/user/add-prompt" title="Add Prompt" />
          <DashboardLink href="/dashboard/user/my-prompts" title="My Prompts" />
          <DashboardLink href="/dashboard/user/saved-prompts" title="Saved Prompts" />
          <DashboardLink href="/dashboard/user/my-reviews" title="My Reviews" />
        </div>
      </section>
    </main>
  );
}

function DashboardLink({ href, title }) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-xl font-black transition hover:-translate-y-1 hover:border-[#967bb6]/70 hover:bg-white/[0.07]"
    >
      {title}
    </Link>
  );
}