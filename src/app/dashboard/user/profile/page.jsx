import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/api/users";
import { getCreatorPrompts } from "@/lib/api/prompts";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/auth/signin");

  const dbUser = await getUserByEmail(session.user.email);
  const user = { ...session.user, ...dbUser };

  const promptsData = await getCreatorPrompts(user.email);
  const totalPrompts = promptsData?.prompts?.length || 0;

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-32 w-32 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-[#967bb6]/20 text-4xl font-black">
                {user.name?.charAt(0) || "U"}
              </div>
            )}

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">
                Profile
              </p>

              <h1 className="mt-2 text-4xl font-black">{user.name}</h1>
              <p className="mt-1 text-white/45">{user.email}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{user.role || "user"}</Badge>
                <Badge>{user.isPremium ? "Premium" : "Free"}</Badge>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Info label="Account Role" value={user.role || "user"} />
            <Info label="Total Prompts" value={totalPrompts} />
            <Info
              label="Subscription"
              value={user.isPremium ? "Premium" : "Free"}
            />
          </div>

          {!user.isPremium && (
            <Link
              href="/payment"
              className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#967bb6]/20"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-[#967bb6]/30 bg-[#967bb6]/15 px-3 py-1 text-xs font-bold uppercase text-[#dfcff4]">
      {children}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121322] p-5">
      <p className="text-sm text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-black capitalize">{value}</p>
    </div>
  );
}