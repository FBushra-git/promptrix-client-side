import SavedPromptsClient from "./SavedPromptsClient";
import { getBookmarkedPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SavedPromptsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/auth/signin");

  const bookmarks = await getBookmarkedPrompts();

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">
            Saved Library
          </p>
          <h1 className="mt-3 text-4xl font-black italic">Saved Prompts</h1>
          <p className="mt-2 text-white/45">Bookmarked prompts from your account.</p>
        </div>

        <SavedPromptsClient
          bookmarks={Array.isArray(bookmarks) ? bookmarks : []}
          user={session.user}
        />
      </section>
    </main>
  );
}