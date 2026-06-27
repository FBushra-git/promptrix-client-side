import PromptTable from "@/app/components/dashboard/PromptTable";
import { getCreatorPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreatorPromptsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const data = await getCreatorPrompts(session.user.email);
  const prompts = data?.prompts || [];

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
          Creator Studio
        </p>

        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Manage <span className="text-purple-400">Prompts</span>
        </h1>

        <p className="text-zinc-500">
          View and control your own AI prompt drops.
        </p>
      </div>

      <PromptTable prompts={prompts}  currentUser={session.user} />
    </main>
  );
}