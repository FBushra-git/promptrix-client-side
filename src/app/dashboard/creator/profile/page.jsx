import { getCurrentUser } from "@/lib/api/users";
import { User, Mail, Crown, CalendarDays, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CreatorProfilePage() {
  const user = await getCurrentUser();

  const isPremium =
    user?.isPremium === true ||
    user?.subscription?.toLowerCase() === "premium";

  return (
    <main className="p-8 text-white">
      <section className="max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
            Creator Profile
          </p>

          <h1 className="text-5xl font-black italic">
            My{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              Profile
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-32 w-32 rounded-3xl border border-white/10 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-[#967bb6]/20 text-5xl font-black">
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h2 className="text-3xl font-black">
                {user?.name || "Unknown User"}
              </h2>

              <p className="mt-2 text-white/50">{user?.email}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
                    isPremium
                      ? "border-yellow-400/40 bg-yellow-400/15 text-yellow-200"
                      : "border-[#967bb6]/30 bg-[#967bb6]/15 text-[#d8c6ef]"
                  }`}
                >
                  <Crown size={16} />
                  {isPremium ? "Premium Member" : "Free Account"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold capitalize text-white/70">
                  <Shield size={16} />
                  {user?.role || "user"}
                </span>
              </div>

              {!isPremium && (
                <Link
                  href="/payment"
                  className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#967bb6]/20"
                >
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InfoCard icon={User} label="Name" value={user?.name || "N/A"} />
          <InfoCard icon={Mail} label="Email" value={user?.email || "N/A"} />
          <InfoCard icon={Shield} label="Role" value={user?.role || "user"} />

          <InfoCard
            icon={Crown}
            label="Plan"
            value={isPremium ? "Premium" : "Free"}
          />

          <InfoCard
            icon={Sparkles}
            label="Subscription"
            value={user?.subscription || "free"}
          />

          <InfoCard
            icon={CalendarDays}
            label="Premium Since"
            value={
              user?.premiumSince
                ? new Date(user.premiumSince).toLocaleDateString()
                : isPremium
                  ? "Active"
                  : "N/A"
            }
          />

          <InfoCard
            icon={CalendarDays}
            label="Joined"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"
            }
          />
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#967bb6]/15 text-[#d8c6ef]">
        <Icon size={20} />
      </div>

      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 break-all text-lg font-bold capitalize">{value}</p>
    </div>
  );
}